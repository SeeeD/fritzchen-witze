import { Routes, Route, Navigate } from 'react-router-dom';
import SwipeStack from './components/SwipeStack';
import jokesData from './data/jokes.json';
import './App.css';

function padId(id) {
  return String(id).padStart(4, '0');
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Einmalig beim Seitenload mischen – Reihenfolge bleibt in der Session konstant
const jokes = shuffle(jokesData);
const first = jokes[0];

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">🤣</div>
        <h1 className="title">
          Fritzchen<span className="title-accent">witze</span>
        </h1>
        <p className="subtitle">Der beste Schüler der Welt</p>
      </header>

      <main className="main">
        <Routes>
          <Route path="/:id/:slug" element={<SwipeStack jokes={jokes} />} />
          <Route path="*" element={<Navigate to={`/${padId(first.id)}/${first.slug}`} replace />} />
        </Routes>
      </main>

      <footer className="footer">
        Made with 😂 &amp; viel Quatsch
      </footer>
    </div>
  );
}
