import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/pages/LandingPage";
import { SecretsPage } from "@/pages/SecretsPage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ScanFeedProvider } from "@/store/scan-feed.context";
import { ScrollToTop } from "@/lib/ScrollToTop";

const App = () => {
  return (
    <ScanFeedProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground flex flex-col relative">
        {}
        <div className="fixed inset-0 bg-grid opacity-[0.02] pointer-events-none -z-10" />
        
        <Navbar />
        <main className="flex-1 relative z-0">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/secrets" element={<SecretsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ScanFeedProvider>
  );
};

export default App;
