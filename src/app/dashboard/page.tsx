
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [profileImage, setProfileImage] = useState<
    string | null | undefined
  >(undefined);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session) return;

    async function loadProfileImage() {
      try {
        const response = await fetch("/api/profile", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        setProfileImage(
          typeof data.user?.image === "string"
            ? data.user.image
            : null
        );
      } catch (error) {
        console.error("Unable to load profile picture:", error);
      }
    }

    loadProfileImage();
  }, [isPending, session]);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090f] text-white">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <LoaderCircle className="h-5 w-5 animate-spin text-violet-400" />
          Loading your dashboard...
        </div>
      </main>
    );
  }

  const user = session.user;
  const imageToShow =
    profileImage === undefined ? user.image : profileImage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090f] text-white">
      <div className="pointer-events-none absolute left-1/3 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

      <header className="relative border-b border-white/[0.08] bg-[#0d0d16]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
              <Sparkles className="h-5 w-5" />
            </span>

            <span className="text-lg font-semibold">
              WhatNext <span className="text-violet-400">AI</span>
            </span>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:border-red-500/30 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-sm text-violet-400">
            <BrainCircuit className="h-4 w-4" />
            Your personal workspace
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {user.name.split(" ")[0]}!
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Your space to explore possibilities, think through decisions,
            and plan your next step.
          </p>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#101018]/85 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 to-blue-600/20 text-violet-300">
                {imageToShow ? (
                  <img
                    src={imageToShow}
                    alt="Your profile picture"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-6 w-6" />
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold">Your Profile</h2>
                <p className="text-sm text-slate-400">
                  Your account information
                </p>
                <Link
                  href="/profile"
                  className="mt-1 inline-block text-sm text-violet-400 transition hover:text-violet-300"
                >
                  Edit profile
                </Link>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Full name
                </p>
                <p className="text-sm text-slate-200">{user.name}</p>
              </div>

              <div className="h-px bg-white/[0.07]" />

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email address
                </p>
                <p className="break-all text-sm text-slate-200">
                  {user.email}
                </p>
              </div>

              <div className="h-px bg-white/[0.07]" />

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Account status
                </p>

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Signed in
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/[0.12] to-blue-600/[0.06] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
              <BrainCircuit className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              Ready for your next decision?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Explore different possibilities and think through your
              options with WhatNext AI.
            </p>

            <Link
              href="/#decision-lab"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Explore Decision Lab
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101018]/70 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-slate-300">
              <CalendarDays className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">Your decision history</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your saved decisions will appear here when decision
                saving is connected to your account.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
