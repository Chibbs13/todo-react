function Logo({ className = "" }) {
  return (
    <svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="logo-grad"
          x1="0"
          y1="0"
          x2="120"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>

      <path
        d="M60 15 C85 15, 105 35, 105 60 C105 85, 85 105, 60 105 C35 105, 15 85, 15 60 C15 40, 30 25, 50 25 C65 25, 75 35, 75 50 C75 65, 65 75, 50 75 C40 75, 35 70, 35 60"
        stroke="url(#logo-grad)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default Logo;
