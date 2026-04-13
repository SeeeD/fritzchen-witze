import { useState, useRef } from 'react';
import JokeCard from './JokeCard';

const GRADIENTS = [
  ['#FF6B6B', '#FFE66D'],
  ['#4ECDC4', '#44A08D'],
  ['#A770EF', '#CF8BF3'],
  ['#f7971e', '#ffd200'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#30cfd0', '#667eea'],
  ['#ff9a9e', '#fad0c4'],
  ['#fbc2eb', '#a6c1ee'],
  ['#ffecd2', '#fcb69f'],
  ['#a1c4fd', '#c2e9fb'],
  ['#d4fc79', '#96e6a1'],
  ['#f6d365', '#fda085'],
  ['#89f7fe', '#66a6ff'],
];

export default function SwipeStack({ jokes }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const directionRef = useRef(0);
  const [cardKey, setCardKey] = useState(0);

  const total = jokes.length;
  const canGoLeft = currentIndex < total - 1;
  const canGoRight = currentIndex > 0;

  const goNext = () => {
    if (!canGoLeft) return;
    directionRef.current = 1;
    setCurrentIndex(i => i + 1);
    setCardKey(k => k + 1);
  };

  const goPrev = () => {
    if (!canGoRight) return;
    directionRef.current = -1;
    setCurrentIndex(i => i - 1);
    setCardKey(k => k + 1);
  };

  const ghostColors1 = GRADIENTS[(currentIndex + 1) % GRADIENTS.length];
  const ghostColors2 = GRADIENTS[(currentIndex + 2) % GRADIENTS.length];

  return (
    <div className="swipe-stack">
      {/* Progress */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
      <div className="progress-label">
        {currentIndex + 1} / {total}
      </div>

      {/* Card stack */}
      <div className="cards-area">
        {/* Decorative ghost cards */}
        <div
          className="ghost-card ghost-back"
          style={{ background: `linear-gradient(145deg, ${ghostColors2[0]}, ${ghostColors2[1]})` }}
        />
        <div
          className="ghost-card ghost-front"
          style={{ background: `linear-gradient(145deg, ${ghostColors1[0]}, ${ghostColors1[1]})` }}
        />

        {/* Active card */}
        <JokeCard
          key={cardKey}
          joke={jokes[currentIndex]}
          colors={GRADIENTS[currentIndex % GRADIENTS.length]}
          enterDirection={directionRef.current}
          onSwipeLeft={goNext}
          onSwipeRight={goPrev}
          canGoLeft={canGoLeft}
          canGoRight={canGoRight}
        />
      </div>

      {/* Navigation buttons */}
      <div className="nav-buttons">
        <button
          className="nav-btn"
          onClick={goPrev}
          disabled={!canGoRight}
          aria-label="Vorheriger Witz"
        >
          ←
        </button>
        <span className="swipe-hint">← Wischen →</span>
        <button
          className="nav-btn"
          onClick={goNext}
          disabled={!canGoLeft}
          aria-label="Nächster Witz"
        >
          →
        </button>
      </div>
    </div>
  );
}
