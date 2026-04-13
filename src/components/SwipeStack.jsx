import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

function padId(id) {
  return String(id).padStart(4, '0');
}

export default function SwipeStack({ jokes }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialIndex = Math.max(0, jokes.findIndex(j => j.id === parseInt(id, 10)));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const total = jokes.length;
  const canGoLeft = currentIndex < total - 1;
  const canGoRight = currentIndex > 0;

  const goTo = (index) => {
    setCurrentIndex(index);
    const joke = jokes[index];
    navigate(`/${padId(joke.id)}/${joke.slug}`, { replace: true });
  };

  const goNext = () => { if (canGoLeft) goTo(currentIndex + 1); };
  const goPrev = () => { if (canGoRight) goTo(currentIndex - 1); };

  return (
    <div className="swipe-stack">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
      </div>
      <div className="progress-label">{currentIndex + 1} / {total}</div>

      <div className="cards-area">
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
