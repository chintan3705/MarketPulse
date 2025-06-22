import type React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  titleClassName?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  icon: Icon,
  description,
  className,
  as: TitleTag = "h1",
  titleClassName,
}) => {
  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      <div className="flex items-center gap-2 mb-1 md:mb-2">
        {Icon && <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />}
        <TitleTag
          className={cn(
            "font-headline text-2xl sm:text-3xl md:text-4xl font-bold",
            titleClassName,
          )}
        >
          {title}
        </TitleTag>
      </div>
      {description && (
        <p className="text-muted-foreground text-sm md:text-base max-w-prose">
          {description}
        </p>
      )}
    </div>
  );
};
