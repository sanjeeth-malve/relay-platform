interface IconProps {
  className?: string;
}

export function UsersIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="6" cy="5.5" r="2.2" />
      <path d="M2.5 13c.4-2 1.8-3 3.5-3s3.1 1 3.5 3" />
      <circle cx="11.5" cy="6" r="1.7" />
      <path d="M10.5 10.3c1.4.2 2.5 1.1 2.9 2.7" />
    </svg>
  );
}

export function UserIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M3 13.5c.6-2.4 2.5-3.5 5-3.5s4.4 1.1 5 3.5" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M8 2L3 4.2v3.6c0 3 2.1 5.4 5 6.2 2.9-.8 5-3.2 5-6.2V4.2L8 2z" />
      <path d="M5.7 8.1l1.6 1.6 3.1-3.3" />
    </svg>
  );
}

export function CpuIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
      <path d="M6.5 2v2.5M9.5 2v2.5M6.5 11.5V14M9.5 11.5V14M2 6.5h2.5M2 9.5h2.5M11.5 6.5H14M11.5 9.5H14" />
    </svg>
  );
}

export function BotIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M8 2v2" />
      <rect x="2.5" y="4" width="11" height="9" rx="2" />
      <circle cx="6" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="10" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
      <path d="M6 11h4" />
    </svg>
  );
}

export function WrenchIcon({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M10.8 2.4a3.2 3.2 0 0 0-3.7 4.4L2.6 11.3a1.2 1.2 0 1 0 1.7 1.7l4.5-4.5a3.2 3.2 0 0 0 4.4-3.7l-1.9 1.9-1.5-1.5 1.9-1.9z" />
    </svg>
  );
}

export function PlusIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
