function Field({ label, requiredLabel, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {requiredLabel && <small>{requiredLabel}</small>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export default function StepChild({ t, active, fields, onChange, errors, onBack, onNext }) {
  return (
    <section className={`form-step${active ? " active" : ""}`} aria-labelledby="child-title">
      <h2 id="child-title">{t("childTitle")}</h2>
      <p className="section-intro">{t("childIntro")}</p>
      <div className="form-grid">
        <Field label={t("lastName")} requiredLabel={t("requiredField")} error={errors.childLastName && t("requiredError")}>
          <input
            autoComplete="family-name"
            maxLength={80}
            value={fields.childLastName}
            aria-invalid={errors.childLastName ? "true" : "false"}
            onChange={(event) => onChange("childLastName", event.target.value)}
          />
        </Field>
        <Field label={t("firstName")} requiredLabel={t("requiredField")} error={errors.childFirstName && t("requiredError")}>
          <input
            autoComplete="given-name"
            maxLength={80}
            value={fields.childFirstName}
            aria-invalid={errors.childFirstName ? "true" : "false"}
            onChange={(event) => onChange("childFirstName", event.target.value)}
          />
        </Field>
        <Field label={t("birthDate")} requiredLabel={t("requiredField")} error={errors.birthDate && t("requiredError")}>
          <input
            type="date"
            value={fields.birthDate}
            aria-invalid={errors.birthDate ? "true" : "false"}
            onChange={(event) => onChange("birthDate", event.target.value)}
          />
        </Field>
        <Field label={t("teamOptional")}>
          <input
            maxLength={80}
            placeholder="z. B. F1 / Jahrgang 2018"
            value={fields.squad}
            onChange={(event) => onChange("squad", event.target.value)}
          />
        </Field>
      </div>
      <div className="button-row">
        <button className="button button-ghost" type="button" onClick={onBack}>← {t("backButton")}</button>
        <button className="button button-primary" type="button" onClick={onNext}>{t("continueButton")} →</button>
      </div>
    </section>
  );
}
