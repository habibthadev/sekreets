import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/pages/LandingPage";
import { SecretsPage } from "@/pages/SecretsPage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { ScanFeedProvider } from "@/store/scan-feed.context";
import { ScrollToTop } from "@/lib/ScrollToTop";

const App = () => {
  return (
    <ScanFeedProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/secrets" element={<SecretsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ScanFeedProvider>
  );
};

export default App;
