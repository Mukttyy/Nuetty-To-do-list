"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { useAuth } from "@/lib/auth-context";

interface DemoAccount {
  email: string;
  password: string;
}

export function LoginView() {
  const { signIn, signUp } = useAuth();
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [demoAccount, setDemoAccount] = React.useState<DemoAccount | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch("/api/demo", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return;
        const value = (await response.json()) as Partial<DemoAccount>;
        if (value.email && value.password) {
          setDemoAccount({ email: value.email, password: value.password });
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || password.length < 8) {
      setError("Enter a valid email and a password of at least 8 characters.");
      return;
    }
    if (isRegistering && name.trim().length < 2) {
      setError("Enter a name of at least 2 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = isRegistering
        ? await signUp(name.trim(), cleanEmail, password)
        : await signIn(cleanEmail, password);
      if (result.error) setError(result.error);
    } catch {
      setError("The request could not be completed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    if (!demoAccount) return;
    setIsRegistering(false);
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
    setError(null);
  };

  return (
    <main className="grid min-h-dvh w-full bg-white lg:grid-cols-2">
      <section
        aria-labelledby="auth-title"
        className="flex min-h-dvh items-start justify-center px-5 py-8 sm:px-10 lg:order-2 lg:items-center lg:px-14 lg:py-12"
      >
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-2 lg:mb-10">
            <BrandMark />
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              Nuetty
            </span>
          </div>

          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500 lg:hidden">
            Everything To Do List
          </p>

          <header>
            <h1 id="auth-title" className="text-2xl font-semibold tracking-tight text-zinc-950">
              {isRegistering ? "Create a test account" : "Sign in to Nuetty"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {isRegistering
                ? "Use this account to test a separate workspace."
                : "Continue with the demo account or your own test account."}
            </p>
          </header>

          {!isRegistering && demoAccount && (
            <section
              aria-labelledby="demo-account-title"
              className="mt-6 border-y border-zinc-200 py-4"
            >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 id="demo-account-title" className="text-xs font-semibold text-zinc-900">
                  Prototype access
                </h2>
                <dl className="mt-2 space-y-1 font-mono text-xs text-zinc-600">
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-zinc-400">Email</dt>
                    <dd className="truncate">{demoAccount.email}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-16 shrink-0 text-zinc-400">Password</dt>
                    <dd className="truncate">{demoAccount.password}</dd>
                  </div>
                </dl>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="shrink-0 rounded-md border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                Use demo
              </button>
            </div>
            </section>
          )}

          {error && (
            <p
              role="alert"
              className="mt-5 border-l-2 border-red-600 pl-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {isRegistering && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-zinc-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 px-3.5 text-sm text-zinc-900 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-200"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              autoFocus={!isRegistering}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-lg border border-zinc-300 px-3.5 text-sm text-zinc-900 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-zinc-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isRegistering ? "new-password" : "current-password"}
                minLength={8}
                maxLength={128}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 pl-3.5 pr-12 text-sm text-zinc-900 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-zinc-500 hover:text-zinc-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {isRegistering && (
              <p className="mt-1.5 text-xs text-zinc-500">At least 8 characters.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-950 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Please wait…" : isRegistering ? "Create account" : "Sign in"}
          </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-500">
            {isRegistering ? "Already have an account?" : "Need a separate workspace?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegistering((value) => !value);
                setError(null);
              }}
              className="font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              {isRegistering ? "Sign in" : "Create a test account"}
            </button>
          </p>
        </div>
      </section>

      <aside
        aria-label="What Nuetty helps you do"
        className="hidden min-h-dvh border-r border-zinc-800 bg-zinc-950 text-white lg:order-1 lg:flex lg:items-center"
      >
        <div className="mx-auto w-full max-w-[480px] px-14 py-16 xl:px-16">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Everything To Do List
          </p>
          <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[1.1] tracking-[-0.035em] text-white xl:text-[42px]">
            Keep commitments clear without over-organizing.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
            Start with the task. Add structure only when it becomes useful.
          </p>
        </div>
      </aside>
    </main>
  );
}
