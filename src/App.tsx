import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Hall } from "@/pages/Hall";
import { EraPage } from "@/pages/EraPage";
import { AnimeDetail } from "@/pages/AnimeDetail";
import { SearchResult } from "@/pages/SearchResult";
import { Favorites } from "@/pages/Favorites";
import { TimeCorridor } from "@/pages/TimeCorridor";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Hall />} />
            <Route path="/time-corridor" element={<TimeCorridor />} />
            <Route path="/era/:eraId" element={<EraPage />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/favorites" element={<Favorites />} />
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
      </div>
    </Router>
  );
}
