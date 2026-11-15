"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  CircleHelp,
  GitBranch,
  Lightbulb,
  LoaderCircle,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

type Scenario = {
  name: string;
  subtitle: string;
  description: string;
  takeaway: string;
};

type AnalysisResult = {
  summary: string;
  scenarios: Scenario[];
  nextSteps: string[];
};

const features = [
  {
    icon: GitBranch,
    title: "Explore scenarios",
    description:
      "Explore different possible outcomes before making an important decision.",
    color: "text-violet-300",
    bg: "bg-violet-500/10",
  },
  {
    icon: Target,
    title: "Compare your options",
    description:
      "Understand the opportunities, risks, and trade-offs behind your choices.",
    color: "text-blue-300",
    bg: "bg-blue-500/10",
  },
  {
    icon: Lightbulb,
    title: "Find your next step",
    description:
      "Turn complicated decisions into a clear and practical action plan.",
    color: "text-amber-300",
    bg: "bg-amber-500/10",
  },
];

const scenarioStyles = [
  {
    icon: ArrowUpRight,
    color: "text-emerald-300",
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/[0.06]",
  },
  {
    icon: TrendingUp,
    color: "text-blue-300",
    border: "border-blue-400/20",
    bg: "bg-blue-400/[0.06]",
  },
  {
    icon: ArrowDownRight,
    color: "text-orange-300",
    border: "border-orange-400/20",
    bg: "bg-orange-400/[0.06]",
  },
];

const demoScenarios: Scenario[] = [
  {
    name: "Best case",
    subtitle: "A positive possibility",
    description:
      "Your plan works well, and you gain valuable experience while moving closer to your goal.",
    takeaway: "Build on the opportunities available to you.",
  },
  {
    name: "Realistic case",
    subtitle: "A balanced possibility",
    description:
      "Progress takes time. You adjust your approach, learn new skills, and improve gradually.",
    takeaway: "Start small and review your progress regularly.",
  },
  {
    name: "Worst case",
    subtitle: "A challenging possibility",
    description:
      "Things may not go as planned. You might face setbacks and need to reconsider your approach.",
    takeaway: "Prepare a backup plan and understand your limits.",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const [decision, setDecision] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  }

  async function exploreDecision() {
    if (!decision.trim()) {
      setError("Please describe your decision first.");
      document.getElementById("decision-input")?.focus();
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision: decision.trim(),
          context: context.trim(),
        }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Analysis failed. Please try again.";

        throw new Error(message);
      }

      const analysis = data as AnalysisResult;

      if (
        typeof analysis.summary !== "string" ||
        !Array.isArray(analysis.scenarios) ||
        analysis.scenarios.length !== 3 ||
        !Array.isArray(analysis.nextSteps)
      ) {
        throw new Error(
          "The AI returned an unexpected response. Please try again.",
        );
      }

      setResult(analysis);

      window.setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setDecision("");
    setContext("");
    setResult(null);
    setError("");
    scrollToSection("decision-lab");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b16] text-slate-100 selection:bg-violet-500/30">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute right-[-180px] top-[35%] h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-indigo-600/[0.07] blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
      
{/* Navigation */}
<header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#080b16]/85 backdrop-blur-xl">
  <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
    <a href="#" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-900/30">
        <BrainCircuit className="h-5 w-5 text-white" />
      </div>

      <div>
        <span className="text-lg font-bold tracking-tight">
          WhatNext<span className="text-violet-400"> AI</span>
        </span>
        <p className="text-[10px] tracking-[0.18em] text-slate-500">
          THINK BEYOND THE OBVIOUS
        </p>
      </div>
    </a>

    {/* Desktop Navigation */}
    <nav className="hidden items-center gap-8 md:flex">
      <a
        href="#features"
        className="text-sm text-slate-400 transition hover:text-white"
      >
        Features
      </a>

      <a
        href="#decision-lab"
        className="text-sm text-slate-400 transition hover:text-white"
      >
        Decision Lab
      </a>

      <a
        href="#how-it-works"
        className="text-sm text-slate-400 transition hover:text-white"
      >
        How it works
      </a>

      {!isPending && session && (
        <Link
          href="/profile"
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-violet-400"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Profile picture"
              className="h-8 w-8 rounded-full border border-violet-400/40 object-cover"
            />
          ) : (
            <UserRound className="h-5 w-5" />
          )}
          Profile
        </Link>
      )}
    </nav>

    {/* Desktop Actions */}
    <div className="hidden items-center gap-3 md:flex">
      {!isPending && !session && (
        <>
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Sign up
          </Link>
        </>
      )}

      {!isPending && session && (
        <Link
          href="/dashboard"
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          Dashboard
        </Link>
      )}

      <Button
        onClick={() => scrollToSection("decision-lab")}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90"
      >
        Try it now <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>

    {/* Mobile Menu Button */}
    <Button
      variant="ghost"
      size="icon"
      aria-label={menuOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={menuOpen}
      className="md:hidden"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      {menuOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  </div>

  {/* Mobile Navigation */}
  {menuOpen && (
    <nav className="space-y-1 border-t border-white/[0.07] px-5 py-4 md:hidden">
      <a
        href="#features"
        onClick={() => setMenuOpen(false)}
        className="block rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
      >
        Features
      </a>

      <a
        href="#decision-lab"
        onClick={() => setMenuOpen(false)}
        className="block rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
      >
        Decision Lab
      </a>

      <a
        href="#how-it-works"
        onClick={() => setMenuOpen(false)}
        className="block rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
      >
        How it works
      </a>

      {!isPending && session && (
        <Link
          href="/profile"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-violet-300 transition hover:bg-white/5"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Profile picture"
              className="h-8 w-8 rounded-full border border-violet-400/40 object-cover"
            />
          ) : (
            <UserRound className="h-5 w-5" />
          )}
          Profile
        </Link>
      )}

      {!isPending && !session && (
        <div className="grid grid-cols-2 gap-3 px-3 pt-3">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-300 transition hover:bg-white/5"
          >
            Login
          </Link>

          <Link
            href="/signup"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
          >
            Sign up
          </Link>
        </div>
      )}

      {!isPending && session && (
        <Link
          href="/dashboard"
          onClick={() => setMenuOpen(false)}
          className="block rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          Dashboard
        </Link>
      )}

      <div className="pt-3">
        <Button
          onClick={() => {
            setMenuOpen(false);
            scrollToSection("decision-lab");
          }}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90"
        >
          Try it now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </nav>
  )}
</header>


        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-32">
          <div>
            <Badge className="mb-7 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-violet-200 hover:bg-violet-500/10">
              <Sparkles className="mr-2 h-3.5 w-3.5" />A smarter way to make
              decisions
            </Badge>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-[68px]">
              Before you choose,
              <span className="mt-2 block bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                explore what if.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Every decision opens a different path. Explore possible outcomes,
              uncover hidden risks, and discover your next move with AI.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => scrollToSection("decision-lab")}
                className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-white shadow-lg shadow-violet-950/30 hover:from-violet-500 hover:to-blue-500"
              >
                Explore your decision
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("how-it-works")}
                className="h-12 rounded-xl border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
              >
                How it works
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Explore multiple possibilities
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-violet-400" />
                Your decision, your choice
              </span>
            </div>
          </div>

          {/* Preview card */}
          <Card className="relative overflow-hidden rounded-3xl border-white/10 bg-[#101426]/90 shadow-2xl shadow-violet-950/20">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-[70px]" />
            <CardHeader className="relative p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <Badge className="border border-violet-400/20 bg-violet-500/10 text-violet-200 hover:bg-violet-500/10">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  AI scenario preview
                </Badge>
                <Zap className="h-5 w-5 text-violet-300" />
              </div>
              <CardTitle className="mt-5 text-xl text-white">
                What if I learn AI development?
              </CardTitle>
              <CardDescription className="leading-6 text-slate-400">
                A quick look at the possibilities behind one decision.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-3 px-6 pb-7 sm:px-8">
              {demoScenarios.map((scenario, index) => {
                const Icon = scenarioStyles[index].icon;
                return (
                  <div
                    key={scenario.name}
                    className={`rounded-2xl border ${scenarioStyles[index].border} ${scenarioStyles[index].bg} p-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/10">
                        <Icon
                          className={`h-5 w-5 ${scenarioStyles[index].color}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {scenario.name}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {scenario.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                  <Lightbulb className="h-5 w-5 text-violet-300" />
                </div>
                <p className="text-sm leading-6 text-slate-400">
                  Think through your options before choosing your next move.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-24 border-y border-white/[0.07] bg-white/[0.015] px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-5 border-white/10 text-slate-300"
              >
                Why WhatNext AI?
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Think clearly. Choose confidently.
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                Make space for better thinking by exploring different sides of
                your decisions.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="rounded-2xl border-white/[0.08] bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-violet-400/20"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                      >
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Decision Lab */}
        <section
          id="decision-lab"
          className="scroll-mt-24 mx-auto grid max-w-7xl items-start gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div className="lg:sticky lg:top-28">
            <Badge className="mb-5 rounded-full border border-violet-400/20 bg-violet-500/10 text-violet-200 hover:bg-violet-500/10">
              <BrainCircuit className="mr-2 h-3.5 w-3.5" />
              Your personal Decision Lab
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your next decision starts here.
            </h2>
            <p className="mt-5 leading-8 text-slate-400">
              Describe the decision you are facing. Add some context so the AI
              can explore possible outcomes and suggest practical next steps.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Consider different possible outcomes",
                "Explore opportunities and potential risks",
                "Get practical next steps to consider",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-300" />
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="rounded-3xl border-white/10 bg-[#101426]/90 shadow-2xl shadow-violet-950/10">
            <CardHeader className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">
                    Explore a decision
                  </CardTitle>
                  <CardDescription className="mt-1 text-slate-400">
                    Tell us what is on your mind.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-7 sm:px-8">
              <div className="space-y-3">
                <label
                  htmlFor="decision-input"
                  className="text-sm font-medium text-slate-200"
                >
                  What decision are you considering?
                </label>
                <Textarea
                  id="decision-input"
                  value={decision}
                  onChange={(event) => {
                    setDecision(event.target.value);
                    setError("");
                    setResult(null);
                  }}
                  placeholder="Example: Should I learn AI development while studying at university?"
                  maxLength={1500}
                  className="min-h-32 resize-y rounded-2xl border-white/10 bg-[#080b16] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-600 focus-visible:border-violet-400/50 focus-visible:ring-violet-400/20"
                />
                <p className="text-right text-xs text-slate-500">
                  {decision.length}/1500
                </p>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="context-input"
                  className="text-sm font-medium text-slate-200"
                >
                  Add context{" "}
                  <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <Textarea
                  id="context-input"
                  value={context}
                  onChange={(event) => {
                    setContext(event.target.value);
                    setError("");
                    setResult(null);
                  }}
                  placeholder="Your goals, available time, budget, concerns..."
                  maxLength={3000}
                  className="min-h-24 resize-y rounded-2xl border-white/10 bg-[#080b16] px-4 py-4 text-sm leading-7 text-white placeholder:text-slate-600 focus-visible:border-violet-400/50 focus-visible:ring-violet-400/20"
                />
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-violet-400/10 bg-violet-500/[0.06] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
                <p className="text-xs leading-6 text-slate-400">
                  AI-generated scenarios are possibilities, not guarantees.
                  Consider your circumstances and verify important information
                  before acting.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {error}
                </p>
              )}

              <Button
                onClick={exploreDecision}
                disabled={loading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-semibold text-white shadow-lg shadow-violet-950/20 hover:from-violet-500 hover:to-blue-500"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing your decision...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Explore possible outcomes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-slate-500">
                Powered by AI · Your decision remains yours
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Results */}
        <section
          id="results"
          className="scroll-mt-24 mx-auto max-w-7xl px-5 pb-24 sm:px-8"
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge
                variant="outline"
                className="mb-4 border-white/10 text-slate-300"
              >
                <GitBranch className="mr-2 h-3.5 w-3.5" />
                Scenario explorer
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Look at all sides.
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                {result
                  ? "Here are the possibilities generated for your decision."
                  : "Your possible outcomes will appear here after you explore a decision."}
              </p>
            </div>

            {result && (
              <Button
                variant="outline"
                onClick={resetForm}
                className="rounded-xl border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
              >
                Start again
              </Button>
            )}
          </div>

          {result && (
            <Card className="mb-6 rounded-2xl border-violet-400/20 bg-violet-500/[0.05]">
              <CardContent className="p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
                  Your decision
                </p>
                <p className="mt-2 font-semibold leading-7 text-white">
                  {decision}
                </p>

                {context.trim() && (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Context: {context}
                  </p>
                )}

                <Separator className="my-5 bg-white/10" />

                <h3 className="text-lg font-semibold text-white">
                  AI Analysis
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {result.summary}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-5 md:grid-cols-3">
            {(result?.scenarios ?? demoScenarios).map((scenario, index) => {
              const style = scenarioStyles[index];
              const Icon = style.icon;

              return (
                <Card
                  key={`${scenario.name}-${index}`}
                  className={`rounded-2xl border ${style.border} ${style.bg}`}
                >
                  <CardHeader className="p-6 pb-3">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-black/10">
                        <Icon className={`h-5 w-5 ${style.color}`} />
                      </div>

                      <Badge
                        variant="outline"
                        className="border-white/10 bg-black/10 text-slate-400"
                      >
                        Possibility
                      </Badge>
                    </div>

                    <CardTitle className="text-xl text-white">
                      {scenario.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {scenario.subtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-2">
                    <p className="text-sm leading-7 text-slate-300">
                      {scenario.description}
                    </p>

                    <Separator className="my-5 bg-white/10" />

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {result ? "Recommended action" : "Consider this"}
                    </p>
                    <p className="text-sm leading-6 text-slate-300">
                      {scenario.takeaway}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {result && (
            <Card className="mt-6 rounded-2xl border-white/10 bg-white/[0.025]">
              <CardHeader>
                <CardTitle className="text-white">Your next steps</CardTitle>
                <CardDescription className="text-slate-400">
                  Practical actions to consider
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ol className="space-y-4">
                  {result.nextSteps.map((step, index) => (
                    <li
                      key={`${index}-${step}`}
                      className="flex gap-3 text-sm leading-6 text-slate-300"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs text-violet-300">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <p className="text-sm leading-7 text-slate-400">
              These scenarios help you think through your options; they cannot
              guarantee what will happen. Important decisions may require advice
              from a qualified professional.
            </p>
          </div>
        </section>

        {/* How it works */}
        {/* How It Works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-y border-white/[0.07] bg-white/[0.015] px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-5 border-white/10 text-slate-300"
              >
                A simple process
              </Badge>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                From uncertainty to a plan.
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                Move from a difficult question to a more informed decision.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Describe",
                  description:
                    "Write down your decision, goals, and the factors that matter.",
                },
                {
                  number: "02",
                  title: "Explore",
                  description:
                    "Examine different scenarios, trade-offs, and uncertainties.",
                },
                {
                  number: "03",
                  title: "Decide",
                  description:
                    "Choose a next step based on your priorities and prepare a backup plan.",
                },
              ].map((step) => (
                <Card
                  key={step.number}
                  className="group rounded-2xl border-white/[0.08] bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-violet-400/20"
                >
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10">
                      <span className="text-sm font-bold tracking-wider text-violet-400">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                onClick={() => scrollToSection("decision-lab")}
                className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 text-white hover:from-violet-500 hover:to-blue-500"
              >
                Try the Decision Lab
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>

              <span className="font-semibold text-white">
                WhatNext<span className="text-violet-400"> AI</span>
              </span>
            </a>

            <p className="text-sm text-slate-500">
              Think clearly. Explore possibilities. Choose thoughtfully.
            </p>

            <p className="text-xs text-slate-600">
              Built with Next.js, Tailwind CSS & shadcn/ui
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
