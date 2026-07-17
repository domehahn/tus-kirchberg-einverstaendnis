import { config } from "../../data/config.js";

export default function StepConsents({ t, lang, active, consentChecked, onToggle, errors, onBack, onNext }) {
  return (
    <section className={`form-step${active ? " active" : ""}`} aria-labelledby="consents-title">
      <h2 id="consents-title">{t("consentsTitle")}</h2>
      <p className="section-intro">{t("consentsIntro")}</p>
      <div className="consent-list">
        {config.consents.map((consent) => {
          const errorKey = `consent_${consent.id}`;
          return (
            <label className="consent-item" key={consent.id}>
              <input
                type="checkbox"
                checked={Boolean(consentChecked[consent.id])}
                aria-invalid={errors[errorKey] ? "true" : "false"}
                onChange={(event) => onToggle(consent.id, event.target.checked)}
              />
              <span className="consent-copy">
                {consent[lang]}
                <span className="consent-meta">{consent.required ? t("mandatoryConsent") : t("optionalConsent")}</span>
                {errors[errorKey] && <span className="field-error">{t("requiredError")}</span>}
              </span>
            </label>
          );
        })}
      </div>
      <div className="button-row">
        <button className="button button-ghost" type="button" onClick={onBack}>← {t("backButton")}</button>
        <button className="button button-primary" type="button" onClick={onNext}>{t("continueButton")} →</button>
      </div>
    </section>
  );
}
