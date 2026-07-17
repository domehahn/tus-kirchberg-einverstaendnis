import { formatDate } from "../../lib/format.js";

export default function ReviewSummary({ t, lang, fields, consentChecked, consents }) {
  return (
    <div className="review-summary">
      <section className="review-block">
        <h3>{t("reviewChild")}</h3>
        <dl className="review-table">
          <dt>{t("firstName")} / {t("lastName")}</dt>
          <dd>{fields.childFirstName} {fields.childLastName}</dd>
          <dt>{t("birthDate")}</dt>
          <dd>{formatDate(lang, fields.birthDate)}</dd>
          <dt>{t("squad")}</dt>
          <dd>{fields.squad || "—"}</dd>
        </dl>
      </section>
      <section className="review-block">
        <h3>{t("reviewGuardian")}</h3>
        <dl className="review-table">
          <dt>{t("firstName")} / {t("lastName")}</dt>
          <dd>{fields.guardianFirstName} {fields.guardianLastName}</dd>
          <dt>{t("email")}</dt>
          <dd>{fields.email}</dd>
          <dt>{t("phone")}</dt>
          <dd>{fields.phone}</dd>
        </dl>
      </section>
      <section className="review-block">
        <h3>{t("reviewConsents")}</h3>
        <ul className="review-consents">
          {consents.map((consent) => {
            const checked = Boolean(consentChecked[consent.id]);
            return (
              <li key={consent.id}>
                <strong>{checked ? "✓" : "○"} {checked ? t("accepted") : t("declined")}:</strong> {consent[lang]}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
