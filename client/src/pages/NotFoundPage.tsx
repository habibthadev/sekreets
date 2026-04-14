import { useNavigate } from "react-router-dom";
import { ShieldOff, Home, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,hsl(0_0%_12%/0.12),transparent)] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-28 sm:pt-28 sm:pb-36">
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-muted-foreground">
              <ShieldOff className="h-3 w-3" />
              Page not found
            </div>

            <h1 className="text-fluid-hero font-bold tracking-tight text-foreground">
              404
            </h1>

            <p className="mt-3 text-fluid-body text-muted-foreground">
              Nothing leaked here.
            </p>

            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="mt-8"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <div className="w-full max-w-xs rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <Terminal className="h-3 w-3 text-muted-foreground ml-auto" />
            </div>
            <div className="px-4 py-3 font-mono-data text-[11px] space-y-1 leading-relaxed">
              <p className="text-muted-foreground">$ sekreets scan</p>
              <p className="text-destructive">error: route not found</p>
              <p className="text-success">hint: try /secrets</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
