import { useState, useCallback } from "react";
import { SwipeCard } from "./SwipeCard";
import { vote, type Color } from "../lib/api";

interface SwipeDeckProps {
  colors: Color[];
  onDone: () => void;
}

export function SwipeDeck({ colors, onDone }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const color = colors[currentIndex];
      if (color) {
        vote(color.id, direction === "right" ? "up" : "down").catch(() => {});
      }

      const next = currentIndex + 1;
      if (next >= colors.length) {
        onDone();
      } else {
        setCurrentIndex(next);
      }
    },
    [currentIndex, colors, onDone],
  );

  if (colors.length === 0) return null;

  const visibleCount = Math.min(3, colors.length - currentIndex);
  const visibleCards = [];

  for (let i = visibleCount - 1; i >= 0; i--) {
    const cardIndex = currentIndex + i;
    const color = colors[cardIndex];
    visibleCards.push(
      <SwipeCard
        key={color.id}
        color={color}
        onSwipe={handleSwipe}
        isTop={i === 0}
        index={cardIndex}
        total={colors.length}
      />,
    );
  }

  return <div className="deck">{visibleCards}</div>;
}
