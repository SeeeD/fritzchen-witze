import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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

function SideCard({ joke, colors, motionX }) {
  return (
    <motion.div
      className="joke-card"
      style={{
        background: `linear-gradient(145deg, ${colors[0]}, ${colors[1]})`,
        x: motionX,
        zIndex: 5,
      }}
    >
      <div className="joke-id">#{padId(joke.id)}</div>
      <div className="joke-content">
        <div className="joke-face">😂</div>
        <p className="joke-text">{joke.text}</p>
      </div>
    </motion.div>
  );
}

export default function SwipeStack({ jokes }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const indexForSlug = (s) => s ? Math.max(0, jokes.findIndex(j => j.slug === s)) : 0;
  const [currentIndex, setCurrentIndex] = useState(() => indexForSlug(slug));

  const topX = useMotionValue(0);
  // Nächste Karte: immer window.innerWidth rechts von der aktuellen
  const nextCardX = useTransform(topX, x => x + window.innerWidth);
  // Vorherige Karte: immer window.innerWidth links von der aktuellen
  const prevCardX = useTransform(topX, x => x - window.innerWidth);

  useEffect(() => {
    const index = indexForSlug(slug);
    if (index !== currentIndex) {
      topX.set(0);
      setCurrentIndex(index);
    }
  }, [slug]);

  useEffect(() => {
    const url = slug
      ? `https://fritzchen-witze.de/${slug}`
      : 'https://fritzchen-witze.de/';
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }, [slug]);

  useEffect(() => {
    const joke = jokes[currentIndex];
    if (!joke) return;
    const firstLine = joke.text.split('\n')[0].trim();
    const short = firstLine.length > 55 ? firstLine.slice(0, 52) + '…' : firstLine;
    document.title = `${short} – Fritzchen-Witze`;
    return () => { document.title = 'Fritzchen-Witze'; };
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex]);

  const total = jokes.length;
  const canGoLeft = currentIndex < total - 1;
  const canGoRight = currentIndex > 0;

  // Wird von JokeCard nach Drag-Threshold UND von Buttons aufgerufen
  const goNext = async () => {
    if (!canGoLeft) return;
    const newIndex = currentIndex + 1;
    await animate(topX, -window.innerWidth, { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] });
    topX.set(0);
    setCurrentIndex(newIndex);
    navigate(`/${jokes[newIndex].slug}`);
  };

  const goPrev = async () => {
    if (!canGoRight) return;
    const newIndex = currentIndex - 1;
    await animate(topX, window.innerWidth, { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] });
    topX.set(0);
    setCurrentIndex(newIndex);
    navigate(`/${jokes[newIndex].slug}`);
  };

  return (
    <div className="swipe-stack">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
      </div>
      <div className="progress-label">{currentIndex + 1} / {total}</div>

      <div className="cards-area">
        {canGoRight && (
          <SideCard
            joke={jokes[currentIndex - 1]}
            colors={GRADIENTS[(currentIndex - 1) % GRADIENTS.length]}
            motionX={prevCardX}
          />
        )}
        {canGoLeft && (
          <SideCard
            joke={jokes[currentIndex + 1]}
            colors={GRADIENTS[(currentIndex + 1) % GRADIENTS.length]}
            motionX={nextCardX}
          />
        )}
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
