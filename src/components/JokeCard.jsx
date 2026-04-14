import { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

function padId(id) {
  return String(id).padStart(4, '0');
}

export default function JokeCard({ joke, colors, sharedX, onSwipeLeft, onSwipeRight, canGoLeft, canGoRight }) {
  const internalX = useMotionValue(0);
  const x = sharedX ?? internalX;

  const rotate = useTransform(x, [-220, 220], [-22, 22]);
  const leftOpacity = useTransform(x, [-120, -40, 0], [1, 0.4, 0]);
  const rightOpacity = useTransform(x, [0, 40, 120], [0, 0.4, 1]);

  const swiped = useRef(false);

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
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{
        x,
        rotate,
        zIndex: 10,
        background: `linear-gradient(145deg, ${colors[0]}, ${colors[1]})`,
        touchAction: 'none',
        cursor: 'grab',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="joke-id">#{padId(joke.id)}</div>

      <a
        className="joke-share"
        href={`https://wa.me/?text=${encodeURIComponent('😂 Dieser Fritzchen-Witz hat mich umgehauen – ich glaub du lachst auch:\n👉 ' + window.location.origin + '/' + joke.slug)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Via WhatsApp teilen"
        onPointerDown={e => e.stopPropagation()}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.214a.75.75 0 0 0 .921.921l5.355-1.477A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.693 9.693 0 0 1-4.964-1.365l-.355-.214-3.698 1.02 1.02-3.698-.214-.355A9.693 9.693 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      </a>

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
  );
}
