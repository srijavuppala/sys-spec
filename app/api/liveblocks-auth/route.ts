import { auth, currentUser } from "@clerk/nextjs/server";
import { getLiveblocks, getUserColor } from "@/lib/liveblocks";

export async function POST(request: Request) {
  const [{ userId }, body] = await Promise.all([
    auth(),
    request.json().catch(() => ({})),
  ]);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const room = typeof body?.room === "string" ? body.room : "";
  if (!room) {
    return new Response("Bad Request", { status: 400 });
  }

  // Fetch user info and check project access in parallel
  const [user, project] = await Promise.all([
    currentUser(),
    (async () => {
      const { prisma } = await import("@/lib/prisma");
      return prisma.project.findFirst({
        where: {
          id: room,
          OR: [{ ownerId: userId }],
        },
        select: { id: true },
      });
    })(),
  ]);

  // Fall back to email-based collaborator check only if owner check failed
  if (!project) {
    const email = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
    if (!email) {
      return new Response("Forbidden", { status: 403 });
    }
    const { prisma } = await import("@/lib/prisma");
    const byEmail = await prisma.project.findFirst({
      where: {
        id: room,
        collaborators: { some: { email: { equals: email, mode: "insensitive" } } },
      },
      select: { id: true },
    });
    if (!byEmail) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  const lb = getLiveblocks();
  const name =
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress ??
    "Anonymous";
  const avatar = user?.imageUrl ?? "";
  const color = getUserColor(userId);

  // Create room if needed + authorize session in parallel
  const session = lb.prepareSession(userId, { userInfo: { name, avatar, color } });
  session.allow(room, session.FULL_ACCESS);

  const [, { status, body: authBody }] = await Promise.all([
    lb.getOrCreateRoom(room, { defaultAccesses: [] }).catch(() => {}),
    session.authorize(),
  ]);

  return new Response(authBody, { status });
}
