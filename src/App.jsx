import SwipeStack from './components/SwipeStack';
import jokes from './data/jokes.json';
import './App.css';

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
        <SwipeStack jokes={jokes} />
      </main>

      <footer className="footer">
        Made with 😂 &amp; viel Quatsch
      </footer>
    </div>
  );
}
