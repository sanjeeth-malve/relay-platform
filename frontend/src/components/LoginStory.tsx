import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

// ---------------------------------------------------------------------------
// Content Definitions (strictly aligned with RELAY product & MVP scope)
// ---------------------------------------------------------------------------

interface ComparisonColumn {
  id: string;
  tag: string;
  summary: string;
  points: readonly string[];
  highlighted: boolean;
}

const COMPARISON_COLUMNS: readonly ComparisonColumn[] = [
  {
    id: "without-relay",
    tag: "Without RELAY",
    summary:
      "Scattered workflows, manual research, disconnected tools and repetitive work.",
    points: [
      "Scattered workflows",
      "Manual research",
      "Disconnected tools",
      "Repetitive work",
    ],
    highlighted: false,
  },
  {
    id: "with-relay",
    tag: "With RELAY",
    summary:
      "Coordinated execution through delegation, orchestration, verification and delivery.",
    points: ["Delegation", "Orchestration", "Verification", "Delivery"],
    highlighted: true,
  },
];

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
}

const WORKFLOW_STEPS: readonly WorkflowStep[] = [
  {
    number: "01",
    title: "Supervisor",
    description: "Understands the request and creates an execution plan.",
  },
  {
    number: "02",
    title: "Specialized Workers",
    description: "Discover, enrich, research and analyze.",
  },
  {
    number: "03",
    title: "Verification",
    description: "Checks evidence and identifies information gaps.",
  },
  {
    number: "04",
    title: "Deliverables",
    description: "Produces structured reports for review.",
  },
];

// ---------------------------------------------------------------------------
// Motion Configuration
// ---------------------------------------------------------------------------

const ARCHITECTURAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const INSTANT_TRANSITION = { duration: 0 };

// ---------------------------------------------------------------------------
// Responsive Hook & Scroll Progress Helpers
// ---------------------------------------------------------------------------

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

function ProgressTrackBar({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const scaled = useTransform(progress, [0, 1], [0.12, 1]);
  const smoothProgress = useSpring(scaled, {
    stiffness: 260,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <div aria-hidden="true" className="h-[2px] w-full bg-border-default">
      <motion.div
        className="h-full origin-left bg-accent-cyan"
        style={{ scaleX: reduced ? scaled : smoothProgress }}
      />
    </div>
  );
}

function DesktopScrollProgress({
  containerRef,
  reduced,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  reduced: boolean;
}) {
  const { scrollYProgress } = useScroll({ container: containerRef });
  return <ProgressTrackBar progress={scrollYProgress} reduced={reduced} />;
}

function StackedScrollProgress({
  targetRef,
  reduced,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  reduced: boolean;
}) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start center", "end end"],
  });
  return <ProgressTrackBar progress={scrollYProgress} reduced={reduced} />;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LoginStory() {
  const storyContainerRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(1);
  // Reveal each section once upon scroll entry; Section 01 reveals on mount.
  const [revealedSections, setRevealedSections] = useState<
    Record<number, boolean>
  >({
    1: true,
  });

  const shouldReduceMotion = Boolean(useReducedMotion());
  const isDesktop = useIsDesktop();

  // Observe story sections for one-time reveal on entry and active chapter tracking.
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(
              entry.target.getAttribute("data-section-index"),
            );
            if (index >= 1 && index <= 4) {
              setRevealedSections((prev) =>
                prev[index] ? prev : { ...prev, [index]: true },
              );
              revealObserver.unobserve(entry.target);
            }
          }
        }
      },
      {
        root: null,
        threshold: 0.12,
      },
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(
              entry.target.getAttribute("data-section-index"),
            );
            if (index >= 1 && index <= 4) {
              setActiveSection(index);
            }
          }
        }
      },
      {
        root: null,
        rootMargin: "-48px 0px -45% 0px",
        threshold: 0.1,
      },
    );

    sectionRefs.current.forEach((el) => {
      if (el) {
        revealObserver.observe(el);
        activeObserver.observe(el);
      }
    });

    return () => {
      revealObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  const handleDiscoverClick = () => {
    const target = sectionRefs.current[1];
    if (!target) return;
    target.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const isRevealed = (index: number) =>
    shouldReduceMotion || Boolean(revealedSections[index]);

  const labelInitial = shouldReduceMotion ? false : { opacity: 0 };
  const headlineInitial = shouldReduceMotion ? false : { opacity: 0, y: 20 };
  const bodyInitial = shouldReduceMotion ? false : { opacity: 0, y: 14 };
  const itemInitial = shouldReduceMotion ? false : { opacity: 0, y: 16 };

  return (
    <section
      ref={storyContainerRef}
      aria-label="RELAY Platform Story"
      className="relay-subtle-scroll relative w-full overflow-x-hidden bg-canvas lg:h-full lg:overflow-y-auto lg:overscroll-contain"
    >
      {/* Top Editorial Bar & Scroll Progress Indicator */}
      <div className="bg-canvas lg:sticky lg:top-0 lg:z-20">
        <div className="mx-auto w-full max-w-[580px] px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4 py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-metadata">
              RELAY // PLATFORM BRIEF
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-wider text-text-secondary">
                <span className="text-accent-cyan">
                  {String(activeSection).padStart(2, "0")}
                </span>
                <span className="text-text-metadata"> / 04</span>
              </span>
            </div>
          </div>
          {isDesktop ? (
            <DesktopScrollProgress
              containerRef={storyContainerRef}
              reduced={shouldReduceMotion}
            />
          ) : (
            <StackedScrollProgress
              targetRef={storyContainerRef}
              reduced={shouldReduceMotion}
            />
          )}
        </div>
      </div>

      {/* Editorial Narrative Stream */}
      <div className="mx-auto w-full max-w-[580px] px-5 sm:px-8 lg:px-10">
        {/* ================================================================
            Section 01 — Introduction
           ================================================================ */}
        <article
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          data-section-index="1"
          className="flex flex-col justify-between border-b border-border-default py-14 sm:py-20 lg:min-h-[calc(100vh-45px)] lg:py-20"
        >
          <div className="flex flex-col">
            <motion.p
              initial={labelInitial}
              animate={{ opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? INSTANT_TRANSITION
                  : { duration: 0.5, ease: ARCHITECTURAL_EASE }
              }
              className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent-cyan"
            >
              01 / THE INTRODUCTION
            </motion.p>

            <motion.h2
              initial={headlineInitial}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? INSTANT_TRANSITION
                  : { duration: 0.65, ease: ARCHITECTURAL_EASE }
              }
              className="mt-5 text-[28px] font-semibold leading-[1.18] tracking-[-0.02em] text-text-primary sm:text-[34px] lg:text-[38px]"
            >
              Work shouldn&apos;t stop at a conversation.
            </motion.h2>

            <motion.p
              initial={bodyInitial}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? INSTANT_TRANSITION
                  : { duration: 0.55, delay: 0.14, ease: ARCHITECTURAL_EASE }
              }
              className="mt-5 max-w-[46ch] text-[15px] leading-[1.65] text-text-secondary sm:text-base"
            >
              Turn business requests into coordinated execution and measurable
              outcomes.
            </motion.p>
          </div>

          <motion.div
            initial={bodyInitial}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.55, delay: 0.24, ease: ARCHITECTURAL_EASE }
            }
            className="mt-12 lg:mt-16"
          >
            <button
              type="button"
              onClick={handleDiscoverClick}
              className="group inline-flex items-center gap-2.5 rounded-[4px] py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-text-metadata transition-colors hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
            >
              <span>SCROLL TO DISCOVER</span>
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5 text-accent-cyan transition-transform group-hover:translate-y-0.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M8 3v10" />
                <path d="M4.5 9.5L8 13l3.5-3.5" />
              </svg>
            </button>
          </motion.div>
        </article>

        {/* ================================================================
            Section 02 — The Problem
           ================================================================ */}
        <article
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          data-section-index="2"
          className="border-b border-border-default py-16 sm:py-20 lg:py-28"
        >
          <motion.p
            initial={labelInitial}
            animate={isRevealed(2) ? { opacity: 1 } : { opacity: 0 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.5, ease: ARCHITECTURAL_EASE }
            }
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent-cyan"
          >
            02 / THE PROBLEM
          </motion.p>

          <motion.h2
            initial={headlineInitial}
            animate={isRevealed(2) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.65, ease: ARCHITECTURAL_EASE }
            }
            className="mt-4 text-[24px] font-semibold leading-[1.22] tracking-[-0.015em] text-text-primary sm:text-[28px]"
          >
            Too many tools. Too much manual coordination.
          </motion.h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {COMPARISON_COLUMNS.map((col, idx) => (
              <motion.div
                key={col.id}
                initial={itemInitial}
                animate={
                  isRevealed(2) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                }
                transition={
                  shouldReduceMotion
                    ? INSTANT_TRANSITION
                    : {
                        duration: 0.55,
                        delay: 0.16 + idx * 0.12,
                        ease: ARCHITECTURAL_EASE,
                      }
                }
                className={`flex flex-col rounded-[6px] border p-5 ${
                  col.highlighted
                    ? "border-accent-cyan/40 bg-surface-2"
                    : "border-border-default bg-surface-1"
                }`}
              >
                <span
                  className={`font-mono text-[11px] font-medium uppercase tracking-[0.06em] ${
                    col.highlighted ? "text-accent-cyan" : "text-text-metadata"
                  }`}
                >
                  {col.tag}
                </span>

                <p
                  className={`mt-3 text-[13px] leading-[1.6] ${
                    col.highlighted
                      ? "text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {col.summary}
                </p>

                <ul
                  className={`mt-4 flex flex-col gap-2 border-t pt-3.5 text-[12px] ${
                    col.highlighted
                      ? "border-border-interactive text-text-secondary"
                      : "border-border-default text-text-metadata"
                  }`}
                >
                  {col.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`inline-block h-1 w-1 shrink-0 rounded-full ${
                          col.highlighted ? "bg-accent-cyan" : "bg-text-metadata"
                        }`}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </article>

        {/* ================================================================
            Section 03 — How RELAY Works
           ================================================================ */}
        <article
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          data-section-index="3"
          className="border-b border-border-default py-16 sm:py-20 lg:py-28"
        >
          <motion.p
            initial={labelInitial}
            animate={isRevealed(3) ? { opacity: 1 } : { opacity: 0 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.5, ease: ARCHITECTURAL_EASE }
            }
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent-cyan"
          >
            03 / HOW RELAY WORKS
          </motion.p>

          <motion.h2
            initial={headlineInitial}
            animate={isRevealed(3) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.65, ease: ARCHITECTURAL_EASE }
            }
            className="mt-4 text-[24px] font-semibold leading-[1.22] tracking-[-0.015em] text-text-primary sm:text-[28px]"
          >
            One request. A coordinated workforce.
          </motion.h2>

          <ol className="mt-8 flex flex-col">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isLast = idx === WORKFLOW_STEPS.length - 1;
              return (
                <motion.li
                  key={step.number}
                  initial={itemInitial}
                  animate={
                    isRevealed(3) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                  }
                  transition={
                    shouldReduceMotion
                      ? INSTANT_TRANSITION
                      : {
                          duration: 0.55,
                          delay: 0.16 + idx * 0.12,
                          ease: ARCHITECTURAL_EASE,
                        }
                  }
                  className="relative flex gap-4 sm:gap-5"
                >
                  {/* Step Number Node + Thin Connecting Rail */}
                  <div className="flex flex-col items-center">
                    <span className="flex h-7 w-8 shrink-0 items-center justify-center rounded-[4px] border border-border-interactive bg-surface-2 font-mono text-[11px] font-medium text-accent-cyan">
                      {step.number}
                    </span>
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="my-1.5 w-px flex-1 bg-border-default"
                      />
                    )}
                  </div>

                  {/* Step Details */}
                  <div className={isLast ? "pt-0.5" : "pb-7 pt-0.5"}>
                    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </article>

        {/* ================================================================
            Section 04 — The Principle
           ================================================================ */}
        <article
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          data-section-index="4"
          className="py-16 sm:py-20 lg:py-28"
        >
          <motion.p
            initial={labelInitial}
            animate={isRevealed(4) ? { opacity: 1 } : { opacity: 0 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.5, ease: ARCHITECTURAL_EASE }
            }
            className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent-cyan"
          >
            04 / THE PRINCIPLE
          </motion.p>

          <motion.h2
            initial={headlineInitial}
            animate={isRevealed(4) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.65, ease: ARCHITECTURAL_EASE }
            }
            className="mt-4 text-[24px] font-semibold leading-[1.22] tracking-[-0.015em] text-text-primary sm:text-[28px]"
          >
            AI does the work. Humans retain control.
          </motion.h2>

          <motion.p
            initial={bodyInitial}
            animate={isRevealed(4) ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.55, delay: 0.14, ease: ARCHITECTURAL_EASE }
            }
            className="mt-4 max-w-[46ch] text-[15px] leading-[1.65] text-text-secondary"
          >
            Transparent execution. Evidence-backed results. Human approvals when
            they matter.
          </motion.p>

          {/* Closing Brand Statement */}
          <motion.div
            initial={itemInitial}
            animate={isRevealed(4) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={
              shouldReduceMotion
                ? INSTANT_TRANSITION
                : { duration: 0.55, delay: 0.26, ease: ARCHITECTURAL_EASE }
            }
            className="mt-10 rounded-[6px] border border-border-default bg-surface-1 p-5 sm:p-6"
          >
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent-cyan">
                RELAY
              </span>
              <p className="text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
                Work moves. Results happen.
              </p>
            </div>
          </motion.div>
        </article>
      </div>
    </section>
  );
}
