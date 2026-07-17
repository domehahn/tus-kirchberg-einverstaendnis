export default function StepIntro({ t, active, onNext, onBlankPdf, blankBusy }) {
  return (
    <section className={`form-step${active ? " active" : ""}`} aria-labelledby="intro-title">
      <div className="hero-copy">
        <div className="hero-icon" aria-hidden="true">⚽</div>
        <h2 id="intro-title">{t("introTitle")}</h2>
        <p>{t("introText")}</p>
        <div className="notice notice-safe">
          <strong>{t("privacyFirstTitle")}</strong>
          <span>{t("privacyFirstText")}</span>
        </div>
      </div>
      <div className="button-row split-actions">
        <button className="button button-secondary" type="button" onClick={onBlankPdf} disabled={blankBusy}>
          <span aria-hidden="true">🖨️</span>
          <span>{t("paperButton")}</span>
        </button>
        <button className="button button-primary" type="button" onClick={onNext}>
          <span>{t("continueButton")}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
