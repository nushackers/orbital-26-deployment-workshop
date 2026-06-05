import { useRef, useState, useCallback } from "react";
import { imageUrl, type Color } from "../lib/api";

interface SwipeCardProps {
  color: Color;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
  index: number;
  total: number;
}

const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.12;

export function SwipeCard({
  color,
  onSwipe,
  isTop,
  index,
  total,
}: SwipeCardProps) {
  const { name, hex, image_key } = color;
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [flying, setFlying] = useState(false);
  const [snap, setSnap] = useState(false);
  const [transform, setTransform] = useState("");

  const stackTransform = `translateY(${(index - (total > 2 ? 2 : total - 1)) * -8}px) scale(${1 - (total - 1 - index) * 0.04})`;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isTop) return;
      setDragging(true);
      setSnap(false);
      startPos.current = { x: e.clientX, y: e.clientY };
      currentPos.current = { x: 0, y: 0 };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [isTop],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isTop || !dragging) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      currentPos.current = { x: dx, y: dy };
      const rotation = dx * ROTATION_FACTOR;
      setTransform(
        `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`,
      );
    },
    [isTop, dragging],
  );

  const handlePointerUp = useCallback(() => {
    if (!isTop || !dragging) return;
    setDragging(false);

    const { x } = currentPos.current;

    if (Math.abs(x) > SWIPE_THRESHOLD) {
      setFlying(true);
      const flyX = x > 0 ? window.innerWidth : -window.innerWidth;
      const rotation = x * ROTATION_FACTOR * 2;
      setTransform(
        `translate(${flyX}px, ${currentPos.current.y}px) rotate(${rotation}deg)`,
      );
      setTimeout(() => onSwipe(x > 0 ? "right" : "left"), 400);
    } else {
      setSnap(true);
      setTransform("");
    }
  }, [isTop, dragging, onSwipe]);

  const likeOpacity = isTop
    ? Math.min(Math.max(currentPos.current.x / SWIPE_THRESHOLD, 0), 1)
    : 0;
  const nopeOpacity = isTop
    ? Math.min(Math.max(-currentPos.current.x / SWIPE_THRESHOLD, 0), 1)
    : 0;

  const className = [
    "card",
    dragging && "dragging",
    flying && "flying",
    snap && "snap",
  ]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = isTop
    ? { transform: transform || undefined }
    : { transform: stackTransform };

  const hasImage = image_key && image_key.length > 0;

  return (
    <div
      ref={cardRef}
      className={className}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="card-bg">
        {hasImage && (
          <img
            className="card-image"
            src={imageUrl(image_key)}
            alt={name}
            draggable={false}
          />
        )}
      </div>
      <div className="card-stamp stamp-like" style={{ opacity: likeOpacity }}>
        Like
      </div>
      <div className="card-stamp stamp-nope" style={{ opacity: nopeOpacity }}>
        Nope
      </div>
      <div className="card-label">
        <span>{name}</span>
        <div className="card-hex">{hex}</div>
      </div>
      {isTop && (
        <div className="card-counter">
          {index + 1} / {total}
        </div>
      )}
    </div>
  );
}
