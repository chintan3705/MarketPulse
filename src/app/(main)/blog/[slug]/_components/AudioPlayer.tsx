"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Headphones, Loader2, Play, Pause, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  textToNarrate: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002";

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  textToNarrate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleListenClick = async () => {
    if (audioSrc) {
      // If audio is already loaded, just play/pause
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          void audioRef.current.play();
        }
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${SITE_URL}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToNarrate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate audio.");
      }

      const { audioDataUri } = await response.json();
      setAudioSrc(audioDataUri);
    } catch (err) {
      const catchedError = err as Error;
      setError(catchedError.message);
      toast({
        title: "Audio Generation Failed",
        description: catchedError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audioElement.addEventListener("play", handlePlay);
      audioElement.addEventListener("pause", handlePause);
      audioElement.addEventListener("ended", handleEnded);

      // Autoplay when src is set
      if (audioSrc) {
        void audioElement.play();
      }

      return () => {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioSrc]);

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleListenClick}
        disabled={isLoading}
        title={
          audioSrc
            ? isPlaying
              ? "Pause narration"
              : "Play narration"
            : "Listen to article summary"
        }
        className="text-xs sm:text-sm"
      >
        {isLoading ? (
          <Loader2 size={14} className="mr-1.5 animate-spin" />
        ) : audioSrc ? (
          isPlaying ? (
            <Pause size={14} className="mr-1.5" />
          ) : (
            <Play size={14} className="mr-1.5" />
          )
        ) : (
          <Headphones size={14} className="mr-1.5" />
        )}
        {isLoading
          ? "Generating..."
          : audioSrc
            ? isPlaying
              ? "Pause"
              : "Play"
            : "Listen"}
      </Button>
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          controls
          className="w-full h-10 rounded-md"
          aria-label="Article audio player"
        >
          Your browser does not support the audio element.
        </audio>
      )}
      {error && !isLoading && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};
