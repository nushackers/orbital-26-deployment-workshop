export interface Color {
  id: string;
  name: string;
  hex: string;
  image_key: string;
  upvotes: number;
  downvotes: number;
}

const BASE = "/api";

export async function fetchColors(): Promise<Color[]> {
  const res = await fetch(`${BASE}/colors`);
  if (!res.ok) throw new Error("Failed to fetch colors");
  return res.json();
}

export async function vote(
  colorId: string,
  direction: "up" | "down",
): Promise<void> {
  await fetch(`${BASE}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ colorId, direction }),
  });
}

export async function fetchResults(): Promise<Color[]> {
  const res = await fetch(`${BASE}/results`);
  if (!res.ok) throw new Error("Failed to fetch results");
  return res.json();
}

export function imageUrl(key: string): string {
  return `${BASE}/images/${key}`;
}
