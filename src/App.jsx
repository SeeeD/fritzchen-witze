import { Routes, Route, Navigate } from 'react-router-dom';
import SwipeStack from './components/SwipeStack';
import jokes from './data/jokes.json';
import './App.css';

function padId(id) {
  return String(id).padStart(4, '0');
}

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
