import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export interface SelectDropdownProps<T extends string> {
  id?: string;
  label: string;
  /** Optional inline prefix inside chip button (e.g., "Region:"). */
  inlineLabel?: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  className?: string;
  menuClassName?: string;
  fullWidth?: boolean;
}

/**
 * Reusable accessible dark dropdown matching RELAY's border, surface, and cyan focus/selection tokens.
 */
export function SelectDropdown<T extends string>({
  id,
  label,
  inlineLabel,
  value,
  options,
  onChange,
  className = "",
  menuClassName = "",
  fullWidth = false,
}: SelectDropdownProps<T>) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const labelId = `${baseId}-label`;
  const triggerId = `${baseId}-trigger`;
  const listboxId = `${baseId}-listbox`;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.indexOf(value)),
  );

  const closeMenu = useCallback((returnFocus = false) => {
    setIsOpen(false);
    if (returnFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const openMenu = useCallback(() => {
    const selectedIdx = options.indexOf(value);
    setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);

    if (triggerRef.current && typeof window !== "undefined") {
      const rect = triggerRef.current.getBoundingClientRect();
      // Align right edge when opening near the right viewport boundary (useful on 375px)
      setAlignRight(rect.left + 210 > window.innerWidth - 16);
    }
    setIsOpen(true);
  }, [options, value]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        closeMenu(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  const selectOption = (nextValue: T) => {
    onChange(nextValue);
    closeMenu(true);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (options.length === 0) return;

    if (!isOpen) {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const chosen = options[activeIndex];
        if (chosen !== undefined) {
          selectOption(chosen);
        }
        break;
      }
      case "Tab":
        closeMenu(false);
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative ${fullWidth ? "block w-full" : "inline-block"} ${className}`}
    >
      <span id={labelId} className="sr-only">
        {label}
      </span>

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={`${labelId} ${triggerId}`}
        aria-activedescendant={
          isOpen ? `${baseId}-option-${activeIndex}` : undefined
        }
        onClick={() => (isOpen ? closeMenu(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={`items-center gap-1.5 rounded-[6px] border transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-cyan ${
          fullWidth
            ? "flex h-9 w-full justify-between px-3 font-sans text-[13px]"
            : "inline-flex min-h-[28px] px-2 py-1 font-mono text-[11px]"
        } ${
          isOpen
            ? "border-accent-cyan bg-surface-2 text-text-primary"
            : fullWidth
              ? "border-border-interactive bg-surface-2 text-text-primary hover:border-text-metadata"
              : "border-border-default bg-surface-2 text-text-secondary hover:border-border-interactive hover:text-text-primary"
        }`}
      >
        {inlineLabel && (
          <span className="shrink-0 text-text-metadata select-none">
            {inlineLabel}:
          </span>
        )}
        <span
          className={
            fullWidth
              ? "min-w-0 truncate text-left text-text-primary"
              : "font-medium text-accent-cyan"
          }
        >
          {value}
        </span>
        <svg
          aria-hidden="true"
          className={`h-3 w-3 shrink-0 text-text-metadata transition-transform duration-150 motion-reduce:transition-none ${
            isOpen ? "rotate-180 text-accent-cyan" : ""
          }`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          className={`absolute top-full z-40 mt-1.5 min-w-[170px] max-w-[calc(100vw-2rem)] rounded-[6px] border border-border-interactive bg-surface-1 p-1 font-mono text-[11px] ${
            alignRight ? "right-0" : "left-0"
          } ${menuClassName}`}
        >
          {options.map((opt, idx) => {
            const isSelected = opt === value;
            const isHighlighted = idx === activeIndex;

            return (
              <li
                key={opt}
                id={`${baseId}-option-${idx}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(event) => {
                  // Prevent blur before selection commits cleanly
                  event.preventDefault();
                }}
                onClick={() => selectOption(opt)}
                className={`flex cursor-pointer items-center justify-between gap-2.5 rounded-[4px] px-2.5 py-1.5 transition-colors whitespace-nowrap ${
                  isSelected
                    ? "bg-accent-cyan/10 font-medium text-accent-cyan"
                    : isHighlighted
                      ? "bg-surface-2 text-text-primary"
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                }`}
              >
                <span className="truncate">{opt}</span>
                {isSelected && (
                  <svg
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-accent-cyan"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3.5 8.5l3 3 6-6.5" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
