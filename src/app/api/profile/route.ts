
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Load the current user's profile picture
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { message: "Please sign in first." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        image: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { message: "Unable to load your profile picture." },
      { status: 500 }
    );
  }
}

// PATCH: Update the current user's profile
export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { message: "Please sign in first." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const image =
      typeof body.image === "string" ? body.image : null;

    if (!name || name.length > 100) {
      return NextResponse.json(
        {
          message:
            "Name is required and must be under 100 characters.",
        },
        { status: 400 }
      );
    }

    if (
      image !== null &&
      image !== "" &&
      (!image.startsWith("data:image/") ||
        image.length > 700_000)
    ) {
      return NextResponse.json(
        {
          message:
            "Please choose a valid image under 500 KB.",
        },
        { status: 400 }
      );
    }

   const updatedUser = await prisma.user.update({
  where: {
    id: session.user.id,
  },
  data: {
    name: name.trim(),
    image: image || null,
  },
  select: {
    id: true,
    name: true,
    email: true,
    image: true,
  },
});

return NextResponse.json({
  message: "Profile updated successfully.",
  user: updatedUser,
});

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      { message: "Unable to update your profile." },
      { status: 500 }
    );
  }
}
