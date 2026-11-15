"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  UserPlus,
  TrendingUp,
  Search,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  LoaderCircle,
} from "lucide-react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/admin/users", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load users."
          );
        }

        setUsers(data.users);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const recentUsers = users.filter((user) => {
    const signupDate = new Date(user.createdAt).getTime();
    const sevenDaysAgo =
      Date.now() - 7 * 24 * 60 * 60 * 1000;

    return signupDate >= sevenDaysAgo;
  }).length;

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <header className="border-b border-white/[0.08] bg-[#0d0d16]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
              <Sparkles className="h-5 w-5" />
            </span>

            <span className="text-lg font-semibold">
              WhatNext <span className="text-violet-400">AI</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-violet-400">
              <ShieldCheck className="h-4 w-4" />
              Administration
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Manage users and monitor your WhatNext AI community.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-300">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <p>{error}</p>

            {error.includes("sign in") && (
              <Link
                href="/login"
                className="mt-2 inline-block font-semibold underline"
              >
                Go to Login
              </Link>
            )}

            {error.includes("Admin access") && (
              <p className="mt-2 text-red-200/80">
                Please sign in using the account whose email
                matches ADMIN_EMAIL in your .env file.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Users"
            value={loading ? "..." : users.length.toString()}
            description="Registered accounts"
            icon={<Users className="h-5 w-5" />}
          />

          <StatCard
            title="Recent Signups"
            value={loading ? "..." : recentUsers.toString()}
            description="Registered in the last 7 days"
            icon={<UserPlus className="h-5 w-5" />}
          />

          <StatCard
            title="Database"
            value={loading ? "..." : error ? "Error" : "Connected"}
            description="Admin users API status"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        <section className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101018]/80">
          <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-semibold">
                Registered Users
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Real accounts retrieved from your database.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-violet-500/60"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-white/[0.025] text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">
                    Email address
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Date joined
                  </th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.06]">
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <span className="inline-flex items-center gap-2 text-slate-400">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Loading users...
                      </span>
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/30 font-semibold text-violet-200">
                            {user.name.charAt(0).toUpperCase()}
                          </div>

                          <span className="font-medium">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-slate-400">
                        {user.email}
                      </td>

                      <td className="px-6 py-5 text-slate-400">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />

                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                          Registered
                        </span>
                      </td>
                    </tr>
                  ))}

                {!loading &&
                  !error &&
                  filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        {search
                          ? "No users match your search."
                          : "No registered users found."}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-white/[0.08] px-6 py-4 text-xs text-slate-500">
            {loading
              ? "Retrieving data..."
              : error
                ? "Unable to retrieve user data."
                : `${filteredUsers.length} user(s) displayed`}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#101018]/80 p-6 transition hover:border-violet-500/30">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>

        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-400">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}