
import Image from 'next/image';
import type { AdConfig } from '@/types';
import { cn } from '@/lib/utils';
import { AreaChart } from 'lucide-react';

interface AdSlotProps {
  config: AdConfig;
}

export function AdSlot({ config }: AdSlotProps) {
  const { type, src, altText, width, height, className, tradingViewWidgetConfig, imageAiHint } =
    config;

  if (type === 'image' && src) {
    return (
      <div
        className={cn(
          'bg-muted/50 flex items-center justify-center overflow-hidden rounded-md shadow',
          className
        )}
        style={{ width: width, height: height }}
      >
        <Image
          src={src}
          alt={altText || 'Advertisement'}
          width={typeof width === 'number' ? width : 300} // Provide default if width is string
          height={typeof height === 'number' ? height : 250} // Provide default if height is string
          className='object-contain'
          data-ai-hint={imageAiHint || 'advertisement'}
        />
      </div>
    );
  }

  if (type === 'script') {
    return (
      <div
        className={cn(
          'bg-muted/50 flex items-center justify-center text-sm text-muted-foreground p-4 rounded-md shadow',
          className
        )}
        style={{ width: width, height: height }}
      >
        Ad Slot (Script Based) - {config.id}
      </div>
    );
  }

  if (type === 'tradingview-widget' && tradingViewWidgetConfig) {
    return (
      <div
        className={cn(
          'bg-card border border-border flex flex-col items-center justify-center text-sm text-muted-foreground p-4 rounded-lg shadow-lg',
          className
        )}
        style={{ width: width, height: height }}
      >
        <AreaChart className='w-16 h-16 text-primary mb-2' />
        <p className='font-semibold text-foreground'>TradingView Chart</p>
        <p className='text-xs'>Symbol: {tradingViewWidgetConfig.symbol || 'N/A'}</p>
        <p className='text-xs mt-2'>(Live chart will be embedded here)</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-muted/50 flex items-center justify-center text-sm text-muted-foreground p-4 rounded-md shadow',
        className
      )}
      style={{ width: '100%', height: 90 }} // Default fallback size
    >
      Advertisement Placeholder
    </div>
  );
}
