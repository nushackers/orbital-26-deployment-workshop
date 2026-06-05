import type { Color } from "../lib/api";

interface ResultsProps {
  colors: Color[];
  onReset: () => void;
}

export function Results({ colors, onReset }: ResultsProps) {
  const sorted = [...colors].sort(
    (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
  );

  return (
    <div className="results">
      <h2>Results</h2>
      <div className="results-list">
        {sorted.map((color, i) => (
          <div key={color.id} className="result-row">
            <span className="result-rank">{i + 1}</span>
            <div
              className="result-swatch"
              style={{ backgroundColor: color.hex }}
            />
            <div className="result-info">
              <div className="result-name">{color.name}</div>
              <div className="result-hex">{color.hex}</div>
            </div>
            <div className="result-score">
              <span className="result-up">{color.upvotes}</span>
              <span className="result-down">{color.downvotes}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-reset" onClick={onReset}>
        Vote Again
      </button>
    </div>
  );
}
