
import type { SVGProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LogoIconSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

interface LogoProps {
  className?: string;
  iconClassName?: string; // For direct styling of the icon if needed via className
  iconSize?: string; // e.g., "h-6 w-6"
  textSize?: string; // e.g., "text-xl"
}

export function Logo({
  className,
  iconClassName,
  iconSize = "h-8 w-8",
  textSize = "text-2xl",
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 text-primary", className)}
      aria-label="MarketPulse Home"
    >
      <LogoIconSvg className={cn(iconSize, iconClassName)} />
      <span className={cn(textSize, "font-headline font-bold")}>
        MarketPulse
      </span>
    </Link>
  );
}
