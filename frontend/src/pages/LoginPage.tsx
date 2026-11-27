import { useState, type FormEvent } from "react";
import { Button } from "../components/Button";
import { LoginStory } from "../components/LoginStory";

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      next.email = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = "Enter a valid work email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    }

    return next;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Supabase Auth integration is scheduled in the authentication task.
    // Do not simulate or fake a successful login session.
    setIsSubmitting(false);
    setErrors({
      form: "Authentication service is not connected yet. Supabase Auth will be wired in the authentication task.",
    });
  };

  const handleSsoClick = () => {
    setErrors({
      form: "Enterprise SSO is not connected yet. Configure Supabase Auth SAML/SSO in the authentication task.",
    });
  };

  const handleForgotPassword = () => {
    setErrors({
      form: "Password reset requires Supabase Auth integration.",
    });
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-canvas text-text-primary lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen w-full grid-cols-1 lg:h-full lg:grid-cols-2">
        {/* Left Pane (First on stacked): Scroll-Driven Editorial Story */}
        <LoginStory />

        {/* Right Pane (Second on stacked): Authentication Form (stationary on desktop) */}
        <section className="relay-subtle-scroll relative flex w-full flex-col items-center justify-center border-t border-border-default bg-canvas px-4 py-8 sm:px-6 sm:py-12 lg:h-full lg:overflow-x-hidden lg:overflow-y-auto lg:border-t-0 lg:pb-16">
          <div className="flex w-full max-w-[360px] flex-col">
            {/* Brand Identity */}
            <div className="mb-8 flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-accent-cyan"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="2" y="2" width="7" height="7" rx="1" fill="currentColor" />
                  <rect
                    x="11"
                    y="2"
                    width="7"
                    height="7"
                    rx="1"
                    fill="currentColor"
                    fillOpacity="0.35"
                  />
                  <rect
                    x="2"
                    y="11"
                    width="7"
                    height="7"
                    rx="1"
                    fill="currentColor"
                    fillOpacity="0.35"
                  />
                  <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor" />
                </svg>
                <span className="text-lg font-semibold tracking-tight text-text-primary">
                  RELAY
                </span>
              </div>
              <p className="text-xs font-medium text-text-secondary">
                Enterprise AI Workforce Platform
              </p>
              <p className="text-[13px] text-text-metadata">
                Work moves. Results happen.
              </p>
            </div>

            {/* Welcome Heading */}
            <div className="mb-6">
              <h1 className="text-lg font-semibold tracking-tight text-text-primary">
                Sign in to your workspace
              </h1>
              <p className="mt-1 text-[13px] text-text-secondary">
                Authenticate with your organization credentials to delegate and monitor tasks.
              </p>
            </div>

            {/* Form-level Error / Status Banner */}
            {errors.form && (
              <div
                role="alert"
                className="mb-4 rounded-[6px] border border-accent-amber/40 bg-accent-amber/10 px-3 py-2.5 text-xs text-accent-amber"
              >
                {errors.form}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Work Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="work-email"
                  className="text-[13px] font-medium text-text-secondary"
                >
                  Work Email
                </label>
                <input
                  id="work-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@company.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "work-email-error" : undefined}
                  className={`h-10 w-full rounded-[6px] border bg-surface-2 px-3 text-sm text-text-primary placeholder:text-text-metadata transition-colors focus:outline-none ${
                    errors.email
                      ? "border-accent-danger focus:border-accent-danger"
                      : "border-border-default focus:border-accent-cyan"
                  }`}
                />
                {errors.email && (
                  <p id="work-email-error" className="text-xs text-accent-danger">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="text-[13px] font-medium text-text-secondary"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative flex items-center">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`h-10 w-full rounded-[6px] border bg-surface-2 pl-3 pr-10 text-sm text-text-primary placeholder:text-text-metadata transition-colors focus:outline-none ${
                      errors.password
                        ? "border-accent-danger focus:border-accent-danger"
                        : "border-border-default focus:border-accent-cyan"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-[4px] text-text-metadata hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-accent-cyan"
                  >
                    {showPassword ? (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M2 2l12 12" />
                        <path d="M6.6 6.6a2 2 0 002.8 2.8" />
                        <path d="M9.9 12.1A7.4 7.4 0 018 12.5c-3.5 0-6-3-6.7-4.5a7.8 7.8 0 012.2-2.8M6.2 3.7A7.2 7.2 0 018 3.5c3.5 0 6 3 6.7 4.5a8 8 0 01-1.6 2.2" />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <path d="M1.3 8C2 6.5 4.5 3.5 8 3.5s6 3 6.7 4.5c-.7 1.5-3.2 4.5-6.7 4.5S2 9.5 1.3 8z" />
                        <circle cx="8" cy="8" r="2" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-xs text-accent-danger">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Primary CTA */}
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="mt-2 h-10 w-full font-semibold"
              >
                {isSubmitting ? "Authenticating..." : "Sign in"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border-default" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-metadata">
                OR
              </span>
              <div className="h-px flex-1 bg-border-default" />
            </div>

            {/* Secondary SSO CTA */}
            <Button
              type="button"
              variant="secondary"
              onClick={handleSsoClick}
              className="h-10 w-full"
            >
              <svg
                className="h-4 w-4 shrink-0 text-text-secondary"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M8 1.5L13.5 3.5v4c0 3.3-2.3 5.8-5.5 7-3.2-1.2-5.5-3.7-5.5-7v-4L8 1.5z" />
                <rect x="6.2" y="7" width="3.6" height="3" rx="0.5" />
                <path d="M7 7V5.8a1 1 0 012 0V7" />
              </svg>
              <span>Continue with Enterprise SSO</span>
            </Button>
          </div>

          {/* Bottom-left Muted Footer */}
          <div className="mt-10 w-full max-w-[360px] lg:absolute lg:right-6 lg:bottom-6 lg:left-6 lg:mt-0 lg:w-auto lg:max-w-none">
            <p className="text-xs text-text-metadata">
              Authorized enterprise access only.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
