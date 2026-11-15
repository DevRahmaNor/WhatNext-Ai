"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { ArrowRight, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message || "Sign up failed. Please try again."
        );
        return;
      }

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090f] px-4 py-12 text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/[0.09] bg-[#101018]/90 p-8 shadow-2xl shadow-violet-950/20 backdrop-blur-xl sm:p-10">
        <Link
          href="/"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to home
        </Link>

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-600/20">
              <Sparkles className="h-5 w-5 text-white" />
            </span>

            <span className="text-lg font-semibold tracking-tight">
              WhatNext <span className="text-violet-400">AI</span>
            </span>
          </Link>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Start exploring possibilities and making confident decisions with
            WhatNext AI.
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}

            {!loading && (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs text-slate-500">ALREADY A MEMBER?</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-violet-400 transition hover:text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-8 text-center text-xs text-slate-600">
          Your next decision starts here.
        </p>
      </div>
    </main>
  );
}