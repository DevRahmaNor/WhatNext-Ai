"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  LoaderCircle,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";


async function compressImage(file: File): Promise<string> {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");

  let scale = Math.min(1, 1200 / Math.max(imageBitmap.width, imageBitmap.height));

  let width = Math.round(imageBitmap.width * scale);
  let height = Math.round(imageBitmap.height * scale);

  const maxSize = 450 * 1024;

  try {
    for (let attempt = 0; attempt < 12; attempt++) {
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to process this image.");
      }

      context.drawImage(imageBitmap, 0, 0, width, height);

      for (const quality of [0.85, 0.7, 0.55, 0.4]) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (result) => {
              if (result) {
                resolve(result);
              } else {
                reject(new Error("Image compression failed."));
              }
            },
            "image/jpeg",
            quality
          );
        });

        if (blob.size <= maxSize) {
          return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
              if (typeof reader.result === "string") {
                resolve(reader.result);
              } else {
                reject(new Error("Unable to read the compressed image."));
              }
            };

            reader.onerror = () => {
              reject(new Error("Unable to read the compressed image."));
            };

            reader.readAsDataURL(blob);
          });
        }
      }

      width = Math.round(width * 0.8);
      height = Math.round(height * 0.8);
    }

    throw new Error(
      "This image could not be compressed enough. Please choose another image."
    );
  } finally {
    imageBitmap.close();
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }

    if (session) {
      setName(session.user.name ?? "");
      setImage(session.user.image ?? "");
    }
  }, [isPending, session, router]);

 async function handleImageChange(
  event: ChangeEvent<HTMLInputElement>
) {
  const input = event.currentTarget;
  const file = input.files?.[0];

  setMessage("");
  setError("");

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setError("Please select a valid image.");
    input.value = "";
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    setError("Please choose an image smaller than 10 MB.");
    input.value = "";
    return;
  }

  try {
    const compressedImage = await compressImage(file);
    setImage(compressedImage);
    setMessage("Image compressed successfully. Save your changes.");
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to process this image."
    );
  } finally {
    input.value = "";
  }
}

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: image || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update profile.");
      }

      setName(result.user.name);
      setImage(result.user.image ?? "");
      setMessage("Your profile has been updated successfully.");

      // Refresh the session data to show the updated name and image.
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090f] text-white">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <LoaderCircle className="h-5 w-5 animate-spin text-violet-400" />
          Loading your profile...
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090f] px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl">
        <header className="mb-10 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
              <Sparkles className="h-5 w-5" />
            </span>

            <span className="text-lg font-semibold">
              WhatNext <span className="text-violet-400">AI</span>
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:border-violet-500/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </header>

        <div className="mb-8">
          <p className="mb-3 flex items-center gap-2 text-sm text-violet-400">
            <UserRound className="h-4 w-4" />
            Account settings
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Edit your profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Update your personal information and profile picture.
          </p>
        </div>

        <section className="rounded-2xl border border-white/[0.08] bg-[#101018]/90 p-6 shadow-2xl shadow-black/20 sm:p-9">
          <div className="mb-8 flex flex-col items-center gap-4 border-b border-white/[0.07] pb-8 sm:flex-row sm:gap-6">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-violet-500/40 bg-gradient-to-br from-violet-600/20 to-blue-600/20">
              {image ? (
                <img
                  src={image}
                  alt="Profile picture preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-11 w-11 text-violet-300" />
              )}

              <label
                htmlFor="profile-image"
                className="absolute inset-x-0 bottom-0 flex cursor-pointer items-center justify-center gap-1 bg-black/70 py-1.5 text-xs text-white transition hover:bg-violet-700/80"
              >
                <Camera className="h-3.5 w-3.5" />
                Change
              </label>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-lg font-semibold">{name || "Your name"}</h2>
              <p className="mt-1 break-all text-sm text-slate-400">
                {session.user.email}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Choose an image smaller than 500 KB.
              </p>
            </div>

            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setMessage("");
                  setError("");
                }}
                maxLength={100}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-white/10 bg-[#09090f] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>

              <input
                type="email"
                value={session.user.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 text-sm text-slate-500 outline-none"
              />

              <p className="mt-2 text-xs text-slate-500">
                Your email address cannot be changed here.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {message}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving changes..." : "Save Changes"}
              </button>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
              >
                Cancel
              </Link>
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Your profile changes are saved to your WhatNext AI account.
        </p>
      </div>
    </main>
  );
}