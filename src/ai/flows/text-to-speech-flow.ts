"use server";
/**
 * @fileOverview A Genkit flow to convert text to speech.
 *
 * Exports:
 * - textToSpeech - A function that handles text-to-speech conversion.
 * - type TextToSpeechInput - The input type for the function.
 * - type TextToSpeechOutput - The output type for the function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import wav from "wav";

const TextToSpeechInputSchema = z.object({
  text: z.string().min(1).describe("The text to convert to speech."),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The generated audio as a Base64 encoded WAV data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'.",
    ),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(
  input: TextToSpeechInput,
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

// Helper function to convert raw PCM audio buffer to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on("error", reject);
    writer.on("data", (d: Buffer) => {
      bufs.push(d);
    });
    writer.on("end", () => {
      resolve(Buffer.concat(bufs).toString("base64"));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: "textToSpeechFlow",
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text }) => {
    console.log("[TTS Flow] Starting text-to-speech conversion...");

    const { media } = await ai.generate({
      model: googleAI.model("gemini-2.5-flash-preview-tts"),
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Algenib" }, // A pleasant, professional voice
          },
        },
      },
      prompt: text,
    });

    if (!media || !media.url) {
      throw new Error("TTS generation failed: no audio media was returned.");
    }

    // The media.url is a data URI with raw PCM data, e.g., 'data:audio/L16;rate=24000;channels=1;base64,....'
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(",") + 1),
      "base64",
    );

    console.log(
      `[TTS Flow] Received PCM audio data (${audioBuffer.length} bytes). Converting to WAV...`,
    );

    const wavBase64 = await toWav(audioBuffer);
    const audioDataUri = `data:audio/wav;base64,${wavBase64}`;

    console.log(
      `[TTS Flow] WAV conversion successful. Returning data URI of length ${audioDataUri.length}.`,
    );

    return {
      audioDataUri,
    };
  },
);
