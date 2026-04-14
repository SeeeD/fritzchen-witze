import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
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

function BgCard({ joke, colors }) {
  return (
    <div
      className="joke-card"
      style={{
        background: `linear-gradient(145deg, ${colors[0]}, ${colors[1]})`,
        transform: 'scale(0.93) translateY(16px)',
      }}
    >
      <div className="joke-id">#{padId(joke.id)}</div>
      <div className="joke-content">
        <div className="joke-face">😂</div>
        <p className="joke-text">{joke.text}</p>
      </div>
    </div>
  );
}

export default function SwipeStack({ jokes }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const initialIndex = slug ? Math.max(0, jokes.findIndex(j => j.slug === slug)) : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Geteilter x-Wert der oberen Karte – steuert welche Hintergrundkarte sichtbar ist
  const topX = useMotionValue(0);

  // Nächste Karte: sichtbar by default, blendet aus wenn nach rechts gezogen wird
  const nextBgOpacity = useTransform(topX, [0, 80], [1, 0]);
  // Vorherige Karte: blendet ein wenn nach rechts gezogen wird
  const prevBgOpacity = useTransform(topX, [0, 80], [0, 1]);

  const total = jokes.length;
  const canGoLeft = currentIndex < total - 1;
  const canGoRight = currentIndex > 0;

  const goTo = (index) => {
    topX.set(0); // synchron zurücksetzen bevor neue Karte rendert
    setCurrentIndex(index);
    const joke = jokes[index];
    navigate(`/${joke.slug}`, { replace: true });
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
        {/* Vorheriger Witz – erscheint beim Rechts-Wischen */}
        {canGoRight && (
          <motion.div className="bg-card-wrapper" style={{ opacity: prevBgOpacity, zIndex: 4 }}>
            <BgCard
              joke={jokes[currentIndex - 1]}
              colors={GRADIENTS[(currentIndex - 1) % GRADIENTS.length]}
            />
          </motion.div>
        )}

        {/* Nächster Witz – sichtbar by default, verschwindet beim Rechts-Wischen */}
        {canGoLeft && (
          <motion.div className="bg-card-wrapper" style={{ opacity: nextBgOpacity, zIndex: 5 }}>
            <BgCard
              joke={jokes[currentIndex + 1]}
              colors={GRADIENTS[(currentIndex + 1) % GRADIENTS.length]}
            />
          </motion.div>
        )}

        {/* Aktuelle Karte */}
        <JokeCard
          key={currentIndex}
          joke={jokes[currentIndex]}
          colors={GRADIENTS[currentIndex % GRADIENTS.length]}
          sharedX={topX}
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
