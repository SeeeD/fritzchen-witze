import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function JokeCard({ joke, isTop, colors, onSwipeLeft, onSwipeRight, canGoLeft, canGoRight }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-22, 22]);
  const leftOpacity = useTransform(x, [-120, -40, 0], [1, 0.4, 0]);
  const rightOpacity = useTransform(x, [0, 40, 120], [0, 0.4, 1]);

  const swiped = useRef(false);

  // Wenn Karte wieder in den Hintergrund wandert: Position und Status zurücksetzen
  useEffect(() => {
    if (!isTop) {
      x.set(0);
      swiped.current = false;
    }
  }, [isTop, x]);

  const handleDragEnd = async (_, { offset, velocity }) => {
    if (swiped.current) return;

    if ((offset.x < -100 || velocity.x < -500) && canGoLeft) {
      swiped.current = true;
      await animate(x, -(window.innerWidth + 300), {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      onSwipeLeft();
    } else if ((offset.x > 100 || velocity.x > 500) && canGoRight) {
      swiped.current = true;
      await animate(x, window.innerWidth + 300, {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      onSwipeRight();
    } else {
      animate(x, 0, { type: 'spring', stiffness: 380, damping: 28 });
    }
  };

  return (
    <motion.div
      className="joke-card"
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{
        scale: isTop ? 1 : 0.93,
        y: isTop ? 0 : 16,
        opacity: 1,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{
        x,
        rotate,
        zIndex: isTop ? 10 : 5,
        background: `linear-gradient(145deg, ${colors[0]}, ${colors[1]})`,
        touchAction: 'none',
        cursor: isTop ? 'grab' : 'default',
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.85}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: 'grabbing' } : undefined}
    >
      {isTop && (
        <>
          <motion.div className="swipe-indicator indicator-left" style={{ opacity: leftOpacity }}>
            <span>Weiter</span>
            <span className="indicator-arrow">→</span>
          </motion.div>
          <motion.div className="swipe-indicator indicator-right" style={{ opacity: rightOpacity }}>
            <span className="indicator-arrow">←</span>
            <span>Zurück</span>
          </motion.div>
        </>
      )}

      <div className="joke-content">
        <div className="joke-face">😂</div>
        <p className="joke-text">{joke.text}</p>
      </div>
    </motion.div>
  );
}
