import { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function JokeCard({ joke, colors, enterDirection, onSwipeLeft, onSwipeRight, canGoLeft, canGoRight }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-22, 22]);
  const leftOpacity = useTransform(x, [-120, -40, 0], [1, 0.4, 0]);
  const rightOpacity = useTransform(x, [0, 40, 120], [0, 0.4, 1]);

  const swiped = useRef(false);

  const handleDragEnd = async (_, { offset, velocity }) => {
    if (swiped.current) return;

    const threshold = 100;
    const vThreshold = 500;

    if ((offset.x < -threshold || velocity.x < -vThreshold) && canGoLeft) {
      swiped.current = true;
      await animate(x, -(window.innerWidth + 300), {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
      onSwipeLeft();
    } else if ((offset.x > threshold || velocity.x > vThreshold) && canGoRight) {
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

  const entryX = enterDirection === 1 ? 500 : enterDirection === -1 ? -500 : 0;

  return (
    // Wrapper: nur für die Slide-in-Animation zuständig (kein x-MotionValue hier)
    <motion.div
      className="card-entry-wrapper"
      initial={{ x: entryX, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, opacity: { duration: 0.15 } }}
    >
      {/* Inneres div: zuständig für Drag */}
      <motion.div
        className="joke-card"
        style={{
          x,
          rotate,
          background: `linear-gradient(145deg, ${colors[0]}, ${colors[1]})`,
          touchAction: 'none',
          cursor: 'grab',
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.85}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing', scale: 1.02 }}
      >
        <motion.div className="swipe-indicator indicator-left" style={{ opacity: leftOpacity }}>
          <span>Weiter</span>
          <span className="indicator-arrow">→</span>
        </motion.div>
        <motion.div className="swipe-indicator indicator-right" style={{ opacity: rightOpacity }}>
          <span className="indicator-arrow">←</span>
          <span>Zurück</span>
        </motion.div>

        <div className="joke-content">
          <div className="joke-face">😂</div>
          <p className="joke-text">{joke.text}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
