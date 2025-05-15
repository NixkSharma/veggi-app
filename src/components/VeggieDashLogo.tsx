import type { SVGProps } from 'react';

const VeggieDashLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    width="150"
    height="37.5" // Adjusted height to maintain aspect ratio for 150px width
    aria-label="VeggieDash Logo"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
    <text
      x="10"
      y="35"
      fontFamily="var(--font-geist-sans), Arial, sans-serif"
      fontSize="30"
      fontWeight="bold"
      fill="url(#logoGradient)"
    >
      VeggieDash
    </text>
    {/* Simple leaf icon */}
    <path 
      d="M175 15 Q 185 5 195 15 Q 185 25 175 15 M 185 10 Q 190 20 185 30 Q 180 20 185 10" 
      fill="hsl(var(--primary))"
      stroke="hsl(var(--primary-foreground))"
      strokeWidth="0.5"
    />
  </svg>
);

export default VeggieDashLogo;
