import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Impressum() {
  useEffect(() => {
    document.title = 'Impressum – Fritzchen-Witze';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);
  return (
    <div className="impressum">
      <Link to="/" className="impressum-back">← Zurück</Link>

      <h2>Impressum</h2>

      <section>
        <h3>Angaben gemäß § 5 TMG</h3>
        <p>
          Stefan Riedinger<br />
          Wasgaustraße 7B<br />
          76877 Offenbach
        </p>
      </section>

      <section>
        <h3>Kontakt</h3>
        <p>
          E-Mail: <a href="mailto:kontakt@fritzchen-witze.de">kontakt@fritzchen-witze.de</a>
        </p>
      </section>

      <section>
        <h3>Inhaltlich verantwortlich</h3>
        <p>Stefan Riedinger (Adresse wie oben)</p>
      </section>

      <section>
        <h3>Haftung für Inhalte</h3>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Die Witze auf dieser Seite dienen
          ausschließlich der Unterhaltung.
        </p>
      </section>

      <section>
        <h3>Urheberrecht</h3>
        <p>
          Die auf dieser Website veröffentlichten Witze sind Folklore und gemeinfrei.
          Das Layout und die Gestaltung der Website sind urheberrechtlich geschützt.
        </p>
      </section>

      <section>
        <h3>Datenschutz &amp; Cookies</h3>
        <p>
          Diese Website verwendet keine Cookies und erhebt keine personenbezogenen Daten.
          Es findet kein Tracking statt. Es werden keine Daten an Dritte weitergegeben.
        </p>
        <p>
          Beim Aufruf der Seite werden vom Hosting-Anbieter (GitHub Pages) technisch
          notwendige Server-Logs gespeichert (IP-Adresse, Zeitstempel, aufgerufene URL).
          Diese Daten werden von GitHub Inc. verarbeitet; es gelten deren{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">
            Datenschutzbestimmungen
          </a>.
        </p>
      </section>
    </div>
  );
}
