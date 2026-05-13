import { ShieldAlert, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-background">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-foreground">
          <ShieldAlert className="h-3 w-3 text-background" />
        </div>
        <span className="text-xs font-semibold tracking-tight">sekreets</span>
      </Link>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        Built with{" "}
        <Heart className="h-3 w-3 text-destructive fill-destructive" /> by{" "}
        <a
          href="https://www.habibthadev.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:underline underline-offset-2 transition-colors"
        >
          habibthadev
        </a>
        {" & "}
        <a
          href="https://bethwel.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:underline underline-offset-2 transition-colors"
        >
          Bethwel
        </a>
      </p>

      <p className="text-xs text-muted-foreground text-center sm:text-right">
        For educational &amp; defensive research only.
      </p>
    </div>
  </footer>
);
