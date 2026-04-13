import { useState } from 'react';
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

  const total = jokes.length;
  const canGoLeft = currentIndex < total - 1;
  const canGoRight = currentIndex > 0;

  const goNext = () => { if (canGoLeft) setCurrentIndex(i => i + 1); };
  const goPrev = () => { if (canGoRight) setCurrentIndex(i => i - 1); };

  return (
    <div className="swipe-stack">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
      </div>
      <div className="progress-label">{currentIndex + 1} / {total}</div>

      <div className="cards-area">
        {/* Hintere Karte – nächster Witz, liegt direkt dahinter */}
        {currentIndex + 1 < total && (
          <JokeCard
            key={currentIndex + 1}
            joke={jokes[currentIndex + 1]}
            isTop={false}
            colors={GRADIENTS[(currentIndex + 1) % GRADIENTS.length]}
            onSwipeLeft={goNext}
            onSwipeRight={goPrev}
            canGoLeft={canGoLeft}
            canGoRight={canGoRight}
          />
        )}

        {/* Vordere Karte – aktueller Witz, swipebar */}
        <JokeCard
          key={currentIndex}
          joke={jokes[currentIndex]}
          isTop={true}
          colors={GRADIENTS[currentIndex % GRADIENTS.length]}
          onSwipeLeft={goNext}
          onSwipeRight={goPrev}
          canGoLeft={canGoLeft}
          canGoRight={canGoRight}
        />
      </div>

      <div className="nav-buttons">
        <button className="nav-btn" onClick={goPrev} disabled={!canGoRight} aria-label="Vorheriger Witz">←</button>
        <span className="swipe-hint">← Wischen →</span>
        <button className="nav-btn" onClick={goNext} disabled={!canGoLeft} aria-label="Nächster Witz">→</button>
      </div>
    </div>
  );
}
