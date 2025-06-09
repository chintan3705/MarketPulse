import type { SVGProps } from 'react';
import Link from 'next/link';

const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
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


export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-primary ${className}`} aria-label="MarketPulse Home">
      <LogoIcon className="h-8 w-8" />
      <span className="text-2xl font-headline font-bold">MarketPulse</span>
    </Link>
  );
}
