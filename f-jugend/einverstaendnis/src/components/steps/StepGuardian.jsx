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

export default function StepGuardian({ t, active, fields, onChange, errors, onBack, onNext }) {
  return (
    <section className={`form-step${active ? " active" : ""}`} aria-labelledby="guardian-title">
      <h2 id="guardian-title">{t("guardianTitle")}</h2>
      <p className="section-intro">{t("guardianIntro")}</p>
      <div className="form-grid">
        <Field label={t("lastName")} requiredLabel={t("requiredField")} error={errors.guardianLastName && t("requiredError")}>
          <input
            autoComplete="family-name"
            maxLength={80}
            value={fields.guardianLastName}
            aria-invalid={errors.guardianLastName ? "true" : "false"}
            onChange={(event) => onChange("guardianLastName", event.target.value)}
          />
        </Field>
        <Field label={t("firstName")} requiredLabel={t("requiredField")} error={errors.guardianFirstName && t("requiredError")}>
          <input
            autoComplete="given-name"
            maxLength={80}
            value={fields.guardianFirstName}
            aria-invalid={errors.guardianFirstName ? "true" : "false"}
            onChange={(event) => onChange("guardianFirstName", event.target.value)}
          />
        </Field>
        <Field label={t("email")} requiredLabel={t("requiredField")} error={errors.email && t("emailError")}>
          <input
            type="email"
            autoComplete="email"
            maxLength={160}
            value={fields.email}
            aria-invalid={errors.email ? "true" : "false"}
            onChange={(event) => onChange("email", event.target.value)}
          />
        </Field>
        <Field label={t("phone")} requiredLabel={t("requiredField")} error={errors.phone && t("requiredError")}>
          <input
            type="tel"
            autoComplete="tel"
            maxLength={40}
            value={fields.phone}
            aria-invalid={errors.phone ? "true" : "false"}
            onChange={(event) => onChange("phone", event.target.value)}
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
