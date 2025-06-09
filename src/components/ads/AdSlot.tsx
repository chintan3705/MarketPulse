import Image from 'next/image';
import type { AdConfig } from '@/types';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  config: AdConfig;
}

export function AdSlot({ config }: AdSlotProps) {
  const { type, src, altText, width, height, className, tradingViewWidgetConfig, imageAiHint } = config;

  if (type === 'image' && src) {
    return (
      <div className={cn("bg-muted/50 flex items-center justify-center overflow-hidden rounded-md shadow", className)} style={{ width: width, height: height }}>
        <Image
          src={src}
          alt={altText || "Advertisement"}
          width={typeof width === 'number' ? width : 300} // Default for '100%' case
          height={typeof height === 'number' ? height : 250}
          className="object-contain"
          data-ai-hint={imageAiHint || "advertisement"}
        />
      </div>
    );
  }

  if (type === 'script') {
    // In a real app, you might use dangerouslySetInnerHTML or a library to manage scripts
    // For now, a placeholder:
    return (
      <div 
        className={cn("bg-muted/50 flex items-center justify-center text-sm text-muted-foreground p-4 rounded-md shadow", className)}
        style={{ width: width, height: height }}
      >
        Ad Slot (Script Based) - {config.id}
      </div>
    );
  }
  
  if (type === 'tradingview-widget') {
     // Placeholder for TradingView widget. Actual implementation would involve their script.
    return (
      <div 
        className={cn("bg-muted/50 flex items-center justify-center text-sm text-muted-foreground p-4 rounded-md shadow", className)}
        style={{ width: width, height: height }}
      >
        TradingView Widget - {config.id}
      </div>
    );
  }


  return (
    <div 
      className={cn("bg-muted/50 flex items-center justify-center text-sm text-muted-foreground p-4 rounded-md shadow", className)}
      style={{ width: '100%', height: 90 }}
    >
      Advertisement Placeholder
    </div>
  );
}
