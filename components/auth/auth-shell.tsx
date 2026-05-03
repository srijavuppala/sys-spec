import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// --- Animated canvas preview ---

type CanvasNode = {
  id: string
  cx: number
  cy: number
  label: string
  dotColor: string
  glowColor: string
  delay: string
}

const CANVAS_NODES: CanvasNode[] = [
  { id: "api",    cx: 150, cy: 42,  label: "API Gateway",   dotColor: "#46bfdc", glowColor: "#46bfdc", delay: "0s"   },
  { id: "client", cx: 55,  cy: 97,  label: "Client",        dotColor: "#6457f9", glowColor: "#6457f9", delay: "2s"   },
  { id: "auth",   cx: 245, cy: 97,  label: "Auth Service",  dotColor: "#6457f9", glowColor: "#6457f9", delay: "4s"   },
  { id: "cache",  cx: 55,  cy: 152, label: "Cache",         dotColor: "#34d399", glowColor: "#34d399", delay: "6s"   },
  { id: "db",     cx: 245, cy: 152, label: "Database",      dotColor: "#46bfdc", glowColor: "#46bfdc", delay: "8s"   },
]

// Half-dimensions: w=80 → hw=40, h=24 → hh=12
const HW = 40
const HH = 12

const CANVAS_EDGES = [
  // Client right → API GW left
  { d: `M ${55 + HW} 97 C 118 97, 110 42, ${150 - HW} 42`, flow: true },
  // API GW right → Auth left
  { d: `M ${150 + HW} 42 C 192 42, 205 97, ${245 - HW} 97`, flow: false },
  // Client bottom → Cache top
  { d: `M 55 ${97 + HH} L 55 ${152 - HH}`, flow: false },
  // Auth bottom → DB top
  { d: `M 245 ${97 + HH} L 245 ${152 - HH}`, flow: false },
  // Cache right → DB left
  { d: `M ${55 + HW} 152 L ${245 - HW} 152`, flow: false },
]

function CanvasPreview() {
  return (
    <div className="relative rounded-xl border border-[#1e2030] bg-[#08090f] overflow-hidden" style={{ height: "185px" }}>
      {/* Status chip */}
      <div className="absolute top-2.5 left-1/2 z-10 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-[#1e2030] bg-[#13141f] px-2.5 py-1">
        <span
          className="h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: "oklch(0.72 0.16 220)" }}
        />
        <span className="text-[9.5px] text-[#a0a0c0]" style={{ fontFamily: "var(--font-dm-mono)" }}>
          generating architecture…
        </span>
      </div>

      {/* Collaborator avatars */}
      <div className="absolute bottom-2.5 right-3 z-10 flex gap-1">
        {["#6457f9", "#46bfdc", "#34d399"].map((c, i) => (
          <div
            key={i}
            className="h-4 w-4 rounded-full border border-[#08090f] text-[8px] font-bold flex items-center justify-center text-white"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <svg viewBox="0 0 300 172" className="w-full h-full" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="canvas-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static edges */}
        {CANVAS_EDGES.map((edge, i) => (
          <path
            key={i}
            d={edge.d}
            stroke="#252637"
            strokeWidth="1.5"
            fill="none"
          />
        ))}

        {/* Animated flow on Client→API GW edge */}
        <path
          d={CANVAS_EDGES[0].d}
          stroke="#46bfdc"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.55"
          strokeDasharray="18 48"
          style={{ animation: "canvas-edge-flow 2.2s linear infinite" }}
        />

        {/* Node highlight rings (cycling) */}
        {CANVAS_NODES.map((node) => (
          <rect
            key={`ring-${node.id}`}
            x={node.cx - HW - 2}
            y={node.cy - HH - 2}
            width={HW * 2 + 4}
            height={HH * 2 + 4}
            rx="8"
            fill={node.glowColor}
            fillOpacity="0.07"
            stroke={node.glowColor}
            strokeWidth="1.5"
            style={{
              opacity: 0,
              animation: `canvas-node-on 10s ${node.delay} ease-in-out infinite`,
              filter: `drop-shadow(0 0 6px ${node.glowColor})`,
            }}
          />
        ))}

        {/* Node boxes */}
        {CANVAS_NODES.map((node) => (
          <g key={node.id}>
            <rect
              x={node.cx - HW}
              y={node.cy - HH}
              width={HW * 2}
              height={HH * 2}
              rx="6"
              fill="#13141f"
              stroke="#252637"
              strokeWidth="1"
            />
            <circle cx={node.cx - HW + 11} cy={node.cy} r="2.5" fill={node.dotColor} opacity="0.85" />
            <text
              x={node.cx - HW + 20}
              y={node.cy + 4}
              fontSize="8.5"
              fill="#a0a0c0"
              style={{ fontFamily: "var(--font-dm-mono, monospace)" }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

// --- Auth shell ---

interface AuthShellProps {
  children: ReactNode
  eyebrow?: string
  title?: ReactNode
  description?: string
  className?: string
}

export function AuthShell({
  children,
  title = (
    <>
      Design systems at the
      <br />
      speed of thought.
    </>
  ),
  description = "Describe your architecture in plain English. System Spec maps it to a shared canvas your whole team can refine in real time.",
  className,
}: AuthShellProps) {
  return (
    <main className={cn("min-h-screen", className)}>
      <div className="relative min-h-screen grid lg:grid-cols-2">
        <div className="absolute inset-0 auth-grid" aria-hidden="true" />
        <div className="absolute inset-0 auth-spotlights" aria-hidden="true" />

        {/* Left panel */}
        <section className="relative hidden lg:flex flex-col justify-between border-r border-[#1e2030] overflow-hidden">
          {/* Logo */}
          <div className="px-10 pt-9">
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: "oklch(0.72 0.16 220)" }}
              >
                <span className="text-[#08090f] font-bold text-[10px] leading-none select-none">S</span>
              </div>
              <span style={{ fontFamily: "var(--font-dm-mono)" }} className="text-sm tracking-tight">
                <span className="text-[#eeeeff]">sys</span>
                <span style={{ color: "oklch(0.72 0.16 220)" }}>/</span>
                <span className="text-[#606080]">spec</span>
              </span>
            </div>
          </div>

          {/* Center content block */}
          <div className="flex flex-col gap-7 px-10 py-10">
            {/* Heading + description */}
            <div>
              <h1
                className="text-[38px] font-semibold leading-[1.06] tracking-[-0.02em] mb-4"
                style={{ fontFamily: "var(--font-syne)", color: "#eeeeff" }}
              >
                {title}
              </h1>
              <p className="text-sm text-[#a0a0c0] leading-relaxed max-w-sm">
                {description}
              </p>
            </div>

            {/* Animated canvas preview */}
            <CanvasPreview />

            {/* Feature list */}
            <ul className="space-y-3">
              {[
                { label: "AI architecture generation",   color: "oklch(0.72 0.16 220)" },
                { label: "Real-time multiplayer canvas",  color: "#6457f9" },
                { label: "One-click Markdown spec export", color: "#34d399" },
              ].map(({ label, color }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-sm text-[#a0a0c0]">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="px-10 pb-9">
            <p className="text-xs text-[#3a3a55]">© 2026 System Spec. All rights reserved.</p>
          </div>
        </section>

        {/* Right panel — auth form */}
        <section className="relative flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-[440px]">
            <div className="auth-card">{children}</div>
          </div>
        </section>
      </div>
    </main>
  )
}
