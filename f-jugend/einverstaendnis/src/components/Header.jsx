export default function Header({ t }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <img className="club-logo" src="/assets/tus-logo.png" alt="Wappen des TuS Kirchberg" />
        <div>
          <p className="club-name">TuS Kirchberg</p>
          <p className="team-title">{t("headerSubtitle")}</p>
        </div>
        <div className="privacy-badge" title="Keine Übertragung von Formulardaten">
          <span aria-hidden="true">🔒</span>
          <span>{t("localOnlyShort")}</span>
        </div>
      </div>
    </header>
  );
}
