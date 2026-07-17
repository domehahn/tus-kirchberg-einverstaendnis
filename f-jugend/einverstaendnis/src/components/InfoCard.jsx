export default function InfoCard({ t }) {
  return (
    <aside className="card info-card">
      <h2>{t("infoTitle")}</h2>
      <ol>
        <li>{t("infoStep1")}</li>
        <li>{t("infoStep2")}</li>
        <li>{t("infoStep3")}</li>
      </ol>
      <div className="data-flow">
        <span>Browser</span>
        <span aria-hidden="true">→</span>
        <span>PDF</span>
        <span aria-hidden="true">→</span>
        <span>{t("yourDevice")}</span>
      </div>
      <p className="small-note">{t("noBackend")}</p>
    </aside>
  );
}
