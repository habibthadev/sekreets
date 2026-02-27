import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Search,
  Zap,
  Eye,
  ExternalLink,
  ChevronRight,
  Lock,
  Activity,
  Github,
  Terminal,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PROVIDERS: { name: string; bg: string; text: string; border: string }[] =
  [
    { name: "OpenAI", bg: "#10a37f1a", text: "#10a37f", border: "#10a37f33" },
    {
      name: "Anthropic",
      bg: "#c964421a",
      text: "#c96442",
      border: "#c9644233",
    },
    {
      name: "Google Gemini",
      bg: "#4285f41a",
      text: "#4285f4",
      border: "#4285f433",
    },
    { name: "Groq", bg: "#f550361a", text: "#f55036", border: "#f5503633" },
    {
      name: "Perplexity",
      bg: "#20b2aa1a",
      text: "#20b2aa",
      border: "#20b2aa33",
    },
    {
      name: "HuggingFace",
      bg: "#ff9d001a",
      text: "#ff9d00",
      border: "#ff9d0033",
    },
    {
      name: "Replicate",
      bg: "#5c6ac41a",
      text: "#5c6ac4",
      border: "#5c6ac433",
    },
    {
      name: "Together AI",
      bg: "#7c3aed1a",
      text: "#7c3aed",
      border: "#7c3aed33",
    },
    { name: "Mistral", bg: "#ff6b6b1a", text: "#ff6b6b", border: "#ff6b6b33" },
    { name: "Cohere", bg: "#39a3f41a", text: "#39a3f4", border: "#39a3f433" },
    {
      name: "ElevenLabs",
      bg: "#a855f71a",
      text: "#a855f7",
      border: "#a855f733",
    },
    { name: "DeepSeek", bg: "#0ea5e91a", text: "#0ea5e9", border: "#0ea5e933" },
    {
      name: "xAI / Grok",
      bg: "#6b72801a",
      text: "#9ca3af",
      border: "#6b728033",
    },
    {
      name: "NVIDIA NIM",
      bg: "#76b9001a",
      text: "#76b900",
      border: "#76b90033",
    },
    {
      name: "OpenRouter",
      bg: "#7c3aed1a",
      text: "#7c3aed",
      border: "#7c3aed33",
    },
    {
      name: "Stability AI",
      bg: "#ec48991a",
      text: "#ec4899",
      border: "#ec489933",
    },
    {
      name: "Fireworks AI",
      bg: "#f973161a",
      text: "#f97316",
      border: "#f9731633",
    },
    {
      name: "Voyage AI",
      bg: "#14b8a61a",
      text: "#14b8a6",
      border: "#14b8a633",
    },
    {
      name: "Azure OpenAI",
      bg: "#0078d41a",
      text: "#0078d4",
      border: "#0078d433",
    },
    {
      name: "AWS Bedrock",
      bg: "#ff9c001a",
      text: "#ff9c00",
      border: "#ff9c0033",
    },
    {
      name: "AI21 Labs",
      bg: "#6366f11a",
      text: "#6366f1",
      border: "#6366f133",
    },
    {
      name: "AssemblyAI",
      bg: "#ef44441a",
      text: "#ef4444",
      border: "#ef444433",
    },
    {
      name: "DeepInfra",
      bg: "#8b5cf61a",
      text: "#8b5cf6",
      border: "#8b5cf633",
    },
    { name: "Cerebras", bg: "#f59e0b1a", text: "#f59e0b", border: "#f59e0b33" },
    {
      name: "Vertex AI",
      bg: "#4285f41a",
      text: "#4285f4",
      border: "#4285f433",
    },
  ];

const FEATURES = [
  {
    icon: Zap,
    title: "Real-time Scanning",
    desc: "Continuously scans GitHub's public event stream for newly pushed files containing AI API keys.",
    accent: "text-yellow-500",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Eye,
    title: "25+ AI Providers",
    desc: "Detects keys from OpenAI, Anthropic, Google, Groq, xAI, NVIDIA and 20+ more with entropy scoring.",
    accent: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Search,
    title: "Precise Detection",
    desc: "Shannon entropy analysis combined with regex patterns reduces false positives to near-zero.",
    accent: "text-purple-500",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Lock,
    title: "Responsible Design",
    desc: "Keys are masked in the UI. Exact repo location and file path are shown for responsible disclosure.",
    accent: "text-green-500",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    icon: Activity,
    title: "Live Dashboard",
    desc: "Provider breakdown, scan statistics, and real-time job monitoring in a single view.",
    accent: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    icon: ExternalLink,
    title: "Direct Links",
    desc: "Every finding links directly to the exact file and line in the GitHub repository.",
    accent: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
];

const STATS = [
  { label: "Providers", value: "25+", icon: ShieldAlert },
  { label: "Patterns", value: "25+", icon: Search },
  { label: "Detection", value: "Entropy + Regex", icon: TrendingUp },
  { label: "Scan Speed", value: "Real-time", icon: Zap },
];

const TerminalMock = () => (
  <div className="w-full max-w-lg mx-auto rounded-xl border border-border bg-card shadow-xl overflow-hidden text-left">
    {}
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
      <span className="h-3 w-3 rounded-full bg-destructive/70" />
      <span className="h-3 w-3 rounded-full bg-warning/70" />
      <span className="h-3 w-3 rounded-full bg-success/70" />
      <Terminal className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
      <span className="text-xs text-muted-foreground font-mono-data">
        sekreets scanner
      </span>
    </div>
    {}
    <div className="px-4 py-4 font-mono-data text-[11px] space-y-1.5 leading-relaxed">
      <p className="text-muted-foreground">$ sekreets scan --provider openai</p>
      <p className="text-muted-foreground">
        → Connecting to GitHub event stream…
      </p>
      <p className="text-success">✓ Stream connected</p>
      <p className="text-muted-foreground">→ Scanning pushed commits…</p>
      <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 mt-2">
        <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-destructive font-semibold">
            FOUND sk-proj-••••••••••••••••••••••
          </p>
          <p className="text-muted-foreground">
            user/my-cool-project · src/config.ts:14
          </p>
          <p className="text-muted-foreground">
            entropy: <span className="text-destructive">4.82</span> provider:{" "}
            <span className="text-[#10a37f]">OpenAI</span>
          </p>
        </div>
      </div>
      <p className="text-muted-foreground animate-scan-pulse">
        → Scanning next event…
        <span className="inline-block w-1.5 h-3 bg-foreground/60 ml-0.5 align-middle" />
      </p>
    </div>
  </div>
);

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {}
        <section className="relative border-b border-border overflow-hidden">
          {}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,hsl(0_0%_12%/0.12),transparent)] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-border to-transparent" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28">
            <div className="flex flex-col items-center gap-10 sm:gap-14">
              <div className="flex flex-col items-center text-center w-full max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-scan-pulse" />
                  Scanner active — monitoring GitHub in real time
                </div>

                <h1 className="text-fluid-hero mb-5 font-bold tracking-tight leading-tight">
                  AI keys left in{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-foreground">
                      plain sight.
                    </span>
                    <span className="absolute inset-x-0 bottom-1 h-[6px] bg-destructive/20 rounded-sm -z-0" />
                  </span>
                  <br className="hidden sm:block" />
                  <span className="text-muted-foreground">
                    We find them first.
                  </span>
                </h1>

                <p className="mb-8 max-w-md text-fluid-body text-muted-foreground leading-relaxed">
                  Sekreets continuously hunts GitHub's public event stream for
                  accidentally committed AI API keys — across{" "}
                  <span className="text-foreground font-medium">
                    25+ providers
                  </span>{" "}
                  — and surfaces them before bad actors do.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    size="lg"
                    onClick={() => navigate("/secrets")}
                    className="w-full sm:w-auto"
                  >
                    Open Scanner
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    How it works
                  </Button>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-success" />
                    Keys always masked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Github className="h-3 w-3" />
                    Public repos only
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="h-3 w-3 text-warning" />
                    No sign-up needed
                  </span>
                </div>
              </div>

              <div className="w-full max-w-2xl">
                <TerminalMock />
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="border-b border-border overflow-hidden py-3 bg-muted/30">
          <div
            className="flex gap-3 whitespace-nowrap"
            style={{ animation: "marquee 35s linear infinite" }}
          >
            {[...PROVIDERS, ...PROVIDERS].map((p, i) => (
              <span
                key={i}
                className="shrink-0 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                style={{
                  background: p.bg,
                  color: p.text,
                  borderColor: p.border,
                }}
              >
                {p.name}
              </span>
            ))}
          </div>
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        {}
        <section className="border-b border-border bg-muted/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {STATS.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-numeric text-xl sm:text-2xl break-words leading-tight">
                    {value}
                  </span>
                  <span className="text-label text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {}
        <section id="features" className="border-b border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
            <div className="mb-10 sm:mb-14 text-center">
              <Badge variant="outline" className="mb-4 text-xs">
                Capabilities
              </Badge>
              <h2 className="text-fluid-title font-bold tracking-tight">
                Everything you need to find leaks fast
              </h2>
              <p className="mt-3 mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
                Built on top of GitHub's real-time event stream with
                battle-tested detection logic.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, desc, accent, bg }) => (
                <div
                  key={title}
                  className="group relative rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm hover:-translate-y-0.5"
                >
                  <div
                    className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border ${bg}`}
                  >
                    <Icon className={`h-4 w-4 ${accent}`} />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {}
        <section className="relative overflow-hidden border-t border-border">
          {}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_100%,hsl(0_84%_60%/0.07),transparent)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(0_0%_10%/0.05),transparent)] pointer-events-none" />

          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 sm:py-28">
            {}
            <div className="flex items-center gap-3 mb-10 sm:mb-14">
              <div className="flex-1 h-px bg-border" />
              <span className="flex items-center gap-1.5 text-xs font-mono-data text-muted-foreground uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-scan-pulse" />
                live threat
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="text-center">
              {}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/8 px-4 py-1.5 text-xs text-destructive font-medium">
                <AlertTriangle className="h-3.5 w-3.5 animate-scan-pulse" />
                API keys are being leaked on GitHub{" "}
                <span className="font-bold">right now</span>
              </div>

              <h2 className="text-fluid-title font-bold tracking-tight mb-4 leading-tight">
                Every second you wait,{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">someone loses a key.</span>
                  <span className="absolute inset-x-0 bottom-1 h-[5px] bg-destructive/25 rounded-sm -z-0" />
                </span>
              </h2>

              <p className="mx-auto mb-10 max-w-lg text-sm text-muted-foreground leading-relaxed">
                No account. No setup. No API token required.{" "}
                <span className="text-foreground font-medium">
                  Just open the scanner
                </span>{" "}
                and watch real leaked AI keys surface from GitHub's public event
                stream — live, masked, and ready for responsible disclosure.
              </p>

              {}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20"
                  onClick={() => navigate("/secrets")}
                >
                  <Zap className="h-4 w-4" />
                  Launch Scanner Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                  onClick={() => navigate("/leaderboard")}
                >
                  <ShieldAlert className="h-4 w-4" />
                  View Hall of Shame
                </Button>
              </div>

              {}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-success" />
                  Keys always masked in UI
                </span>
                <span className="flex items-center gap-1.5">
                  <Github className="h-3 w-3" />
                  Public repos only
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-blue-400" />
                  25+ providers detected
                </span>
                <span className="flex items-center gap-1.5">
                  <Search className="h-3 w-3 text-purple-400" />
                  Entropy + regex analysis
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
