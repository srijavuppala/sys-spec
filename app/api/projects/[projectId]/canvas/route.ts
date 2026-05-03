import { get, put } from "@vercel/blob"
import { prisma } from "@/lib/prisma"
import { getCurrentProjectIdentity, userHasProjectAccess } from "@/lib/project-access"
import type { NextRequest } from "next/server"

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
}

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/projects/[projectId]/canvas">
) {
  const identity = await getCurrentProjectIdentity()
  if (!identity.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params
  const hasAccess = await userHasProjectAccess(projectId, identity)
  if (!hasAccess) return Response.json({ error: "Not found" }, { status: 404 })

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { canvasBlobUrl: true },
  })

  if (!project?.canvasBlobUrl) return Response.json({ canvas: null })

  if (!blobConfigured()) {
    // Avoid throwing 500s when the dev environment doesn't have Blob configured.
    return Response.json({ canvas: null })
  }

  try {
    const result = await get(project.canvasBlobUrl, { access: "private" })
    if (!result || result.statusCode !== 200 || !result.stream) return Response.json({ canvas: null })

    const canvas: unknown = await new Response(result.stream).json()
    return Response.json({ canvas })
  } catch {
    // Treat blob failures as "no saved canvas" rather than crashing the route.
    return Response.json({ canvas: null })
  }
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/projects/[projectId]/canvas">
) {
  const identity = await getCurrentProjectIdentity()
  if (!identity.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await ctx.params
  const hasAccess = await userHasProjectAccess(projectId, identity)
  if (!hasAccess) return Response.json({ error: "Not found" }, { status: 404 })

  const body: unknown = await request.json().catch(() => ({}))
  if (!blobConfigured()) {
    return Response.json({ error: "Blob storage not configured" }, { status: 503 })
  }

  let blobUrl: string
  try {
    const blob = await put(`canvas/${projectId}.json`, JSON.stringify(body), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    blobUrl = blob.url
  } catch {
    return Response.json({ error: "Failed to save canvas" }, { status: 503 })
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { canvasBlobUrl: blobUrl },
  })

  return Response.json({ url: blobUrl })
}
