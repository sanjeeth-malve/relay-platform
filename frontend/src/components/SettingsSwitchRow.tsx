export interface SettingsSwitchRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: (nextChecked: boolean) => void;
  disabled?: boolean;
  scopeBadge?: string;
}

export function SettingsSwitchRow({
  id,
  label,
  description,
  checked,
  onToggle,
  disabled = false,
  scopeBadge,
}: SettingsSwitchRowProps) {
  const labelId = `${id}-label`;
  const descId = `${id}-desc`;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-surface-2/40">
      <div className="min-w-0 space-y-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            id={labelId}
            className="text-[13px] font-medium text-text-primary"
          >
            {label}
          </span>
          {scopeBadge && (
            <span className="rounded-[4px] border border-border-default bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-metadata">
              {scopeBadge}
            </span>
          )}
        </div>
        <p id={descId} className="text-xs leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descId}
        disabled={disabled}
        onClick={() => onToggle(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan disabled:cursor-not-allowed disabled:opacity-50 ${
          checked
            ? "border-accent-cyan bg-accent-cyan"
            : "border-border-interactive bg-surface-2"
        }`}
      >
        <span
          aria-hidden="true"
          className={`block h-3.5 w-3.5 rounded-full bg-text-primary transition-transform motion-reduce:transition-none ${
            checked ? "translate-x-4 bg-canvas" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
