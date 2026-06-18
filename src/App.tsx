import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hall } from "@/pages/Hall";
import { EraPage } from "@/pages/EraPage";
import { AnimeDetail } from "@/pages/AnimeDetail";
import { SearchResult } from "@/pages/SearchResult";
import { Favorites } from "@/pages/Favorites";
import { TimeCorridor } from "@/pages/TimeCorridor";
import { CharacterMuseum } from "@/pages/CharacterMuseum";
import { CharacterDetail } from "@/pages/CharacterDetail";
import { CharacterBattle } from "@/pages/CharacterBattle";
import { CharacterLeaderboard } from "@/pages/CharacterLeaderboard";
import { CharacterCollection } from "@/pages/CharacterCollection";
import { AnimationWorkshop } from "@/pages/AnimationWorkshop";
import { TreasureHunt } from "@/pages/TreasureHunt";
import { AchievementCenter } from "@/pages/AchievementCenter";
import { ExploreMap } from "@/pages/ExploreMap";
import { RepairCenter } from "@/pages/RepairCenter";
import { NewDiscoveryModal } from "@/components/NewDiscoveryModal";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Hall />} />
            <Route path="/explore" element={<ExploreMap />} />
            <Route path="/time-corridor" element={<TimeCorridor />} />
            <Route path="/era/:eraId" element={<EraPage />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/characters" element={<CharacterMuseum />} />
            <Route path="/character/:id" element={<CharacterDetail />} />
            <Route path="/characters/battle" element={<CharacterBattle />} />
            <Route path="/characters/leaderboard" element={<CharacterLeaderboard />} />
            <Route path="/characters/collection" element={<CharacterCollection />} />
            <Route path="/workshop" element={<AnimationWorkshop />} />
            <Route path="/treasure-hunt" element={<TreasureHunt />} />
            <Route path="/achievements" element={<AchievementCenter />} />
            <Route path="/repair-center" element={<RepairCenter />} />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="font-display text-6xl font-bold text-white mb-4">404</h1>
                  <p className="text-museum-textMuted mb-8">页面不存在</p>
                  <a href="/" className="text-80s-primary hover:underline">
                    返回大厅
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <NewDiscoveryModal />
      </div>
    </Router>
  );
}
