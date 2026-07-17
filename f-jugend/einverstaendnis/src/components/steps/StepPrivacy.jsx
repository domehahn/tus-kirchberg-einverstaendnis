export default function StepPrivacy({ t, active, privacyAccepted, onChangePrivacy, showError, onBack, onNext }) {
  return (
    <section className={`form-step${active ? " active" : ""}`} aria-labelledby="privacy-title">
      <h2 id="privacy-title">{t("privacyTitle")}</h2>
      <div className="legal-box">
        <p>{t("privacyParagraph1")}</p>
        <p>{t("privacyParagraph2")}</p>
        <p><strong>{t("privacyWarning")}</strong> <span>{t("privacyParagraph3")}</span></p>
      </div>
      <label className="check-row required-row">
        <input
          type="checkbox"
          checked={privacyAccepted}
          onChange={(event) => onChangePrivacy(event.target.checked)}
          aria-invalid={showError ? "true" : "false"}
        />
        <span>
          <span>{t("privacyAcceptance")}</span> <em>{t("requiredMark")}</em>
        </span>
      </label>
      {showError && <p className="field-error">{t("requiredError")}</p>}
      <div className="button-row">
        <button className="button button-ghost" type="button" onClick={onBack}>← {t("backButton")}</button>
        <button className="button button-primary" type="button" onClick={onNext}>{t("agreeContinue")} →</button>
      </div>
    </section>
  );
}
