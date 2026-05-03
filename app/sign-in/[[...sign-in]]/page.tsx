import { SignIn } from "@clerk/nextjs"
import { AuthShell } from "@/components/auth/auth-shell"

export default function SignInPage() {
  return (
    <AuthShell>
      <SignIn
        appearance={{
          elements: {
            card: "bg-transparent shadow-none border-0",
            headerTitle: "text-text-primary text-base font-semibold tracking-tight",
            headerSubtitle: "text-text-muted",
            socialButtonsBlockButton:
              "rounded-2xl border border-border-default/70 bg-bg-surface/50 backdrop-blur-md text-text-primary shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] hover:bg-bg-surface/70 transition-colors",
            socialButtonsBlockButtonText: "text-text-secondary font-medium",
            dividerLine: "bg-border-default/70",
            dividerText: "text-text-faint",
            formFieldLabel: "text-text-secondary",
            formFieldInput:
              "rounded-2xl bg-bg-elevated/80 border border-border-default/70 text-text-primary placeholder:text-text-faint focus-visible:ring-2 focus-visible:ring-accent-primary/40 focus-visible:ring-offset-0 transition-shadow",
            formButtonPrimary:
              "rounded-2xl bg-accent-primary text-bg-base hover:bg-accent-primary/90 transition-colors shadow-sm shadow-accent-primary/20",
            footerActionText: "text-text-faint",
            footerActionLink: "text-accent-primary hover:text-accent-primary/85",
          },
        }}
      />
    </AuthShell>
  )
}
