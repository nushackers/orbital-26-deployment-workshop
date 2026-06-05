import { useState, useEffect, useCallback } from "react";
import { SwipeDeck } from "./components/SwipeDeck";
import { Results } from "./components/Results";
import { fetchColors, fetchResults, type Color } from "./lib/api";

type View = "loading" | "swipe" | "results";

export function App() {
  const [view, setView] = useState<View>("loading");
  const [colors, setColors] = useState<Color[]>([]);
  const [results, setResults] = useState<Color[]>([]);

  useEffect(() => {
    fetchColors()
      .then((data) => {
        setColors(data);
        setView("swipe");
      })
      .catch(() => {
        setColors([]);
        setView("swipe");
      });
  }, []);

  const handleDone = useCallback(async () => {
    try {
      const data = await fetchResults();
      setResults(data.length > 0 ? data : colors);
    } catch {
      setResults(colors);
    }
    setView("results");
  }, [colors]);

  if (view === "loading") {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (view === "results") {
    return <Results colors={results} onReset={() => window.location.reload()} />;
  }

  if (colors.length === 0) {
    return (
      <div className="app">
        <h1 className="title">Color Swipe</h1>
        <p className="subtitle">Swipe right to upvote, left to downvote</p>
        <div className="empty-state">
          <p>No colors found.</p>
          <p>Set up Supabase and run <code>pnpm migrate</code> to seed data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="title">Color Swipe</h1>
      <p className="subtitle">Swipe right to upvote, left to downvote</p>
      <SwipeDeck colors={colors} onDone={handleDone} />
    </div>
  );
}
