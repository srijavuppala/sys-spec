import { prisma } from "@/lib/prisma"
import { getCurrentProjectIdentity, userHasProjectAccess } from "@/lib/project-access"
import type { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ projectId: string; specId: string }> }
) {
  const identity = await getCurrentProjectIdentity()
  if (!identity.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId, specId } = await ctx.params

  const hasAccess = await userHasProjectAccess(projectId, identity)
  if (!hasAccess) return Response.json({ error: "Not found" }, { status: 404 })

  const spec = await prisma.projectSpec.findFirst({
    where: { id: specId, projectId },
  })
  if (!spec) return Response.json({ error: "Not found" }, { status: 404 })

  // Blob-first: `filePath` is a Vercel Blob signed URL — fetch content directly.
  // Fallback: older inline storage where `filePath` contains raw Markdown.
  const ref = spec.filePath ?? ""
  if (ref.startsWith("http")) {
    const blobRes = await fetch(ref)
    if (!blobRes.ok || !blobRes.body) {
      return Response.json({ error: "Not found" }, { status: 404 })
    }
    return new Response(blobRes.body, {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
  }

  return new Response(ref, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
