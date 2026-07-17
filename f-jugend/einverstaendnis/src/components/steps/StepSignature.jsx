import ReviewSummary from "./ReviewSummary.jsx";
import { config } from "../../data/config.js";

export default function StepSignature({
  t,
  lang,
  active,
  fields,
  onChange,
  errors,
  consentChecked,
  canvasRef,
  signatureStarted,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClearSignature,
  honeypot,
  onHoneypotChange,
  onBack,
  submitting
}) {
  return (
    <section className={`form-step${active ? " active" : ""}`} aria-labelledby="signature-title">
      <h2 id="signature-title">{t("signatureTitle")}</h2>
      <ReviewSummary t={t} lang={lang} fields={fields} consentChecked={consentChecked} consents={config.consents} />
      <div className="form-grid compact-grid">
        <label className="field">
          <span>{t("place")}</span>
          <input
            maxLength={80}
            value={fields.place}
            aria-invalid={errors.place ? "true" : "false"}
            onChange={(event) => onChange("place", event.target.value)}
          />
          <small>{t("requiredField")}</small>
          {errors.place && <span className="field-error">{t("requiredError")}</span>}
        </label>
        <label className="field">
          <span>{t("date")}</span>
          <input
            type="date"
            value={fields.signatureDate}
            aria-invalid={errors.signatureDate ? "true" : "false"}
            onChange={(event) => onChange("signatureDate", event.target.value)}
          />
          <small>{t("requiredField")}</small>
          {errors.signatureDate && <span className="field-error">{t("requiredError")}</span>}
        </label>
      </div>
      <fieldset className="signature-fieldset">
        <legend><span>{t("signatureLegend")}</span> <em>{t("requiredMark")}</em></legend>
        <div className="signature-wrapper">
          <canvas
            ref={canvasRef}
            width="900"
            height="260"
            aria-label="Unterschriftsfeld"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
            tabIndex={0}
          />
          {!signatureStarted && <span className="signature-placeholder">{t("signaturePlaceholder")}</span>}
        </div>
        <div className="signature-actions">
          <button className="text-button" type="button" onClick={onClearSignature}>{t("clearSignature")}</button>
        </div>
        {errors.signature && <p className="field-error">{t("signatureError")}</p>}
      </fieldset>

      <label className="honeypot" aria-hidden="true">
        Website <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => onHoneypotChange(event.target.value)} />
      </label>

      <div className="notice">
        <strong>{t("finalNoticeTitle")}</strong>
        <span>{t("finalNoticeText")}</span>
      </div>
      <div className="button-row">
        <button className="button button-ghost" type="button" onClick={onBack}>← {t("backButton")}</button>
        <button className="button button-primary" type="submit" disabled={submitting}>
          {t("createPdf")} ↓
        </button>
      </div>
    </section>
  );
}
