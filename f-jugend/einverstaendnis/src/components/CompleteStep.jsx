export default function CompleteStep({ t, active, onDownloadAgain, onShare, onEmail, onWhatsapp, onPrint, onNewChild }) {
  return (
    <section className={`form-step complete-step${active ? " active" : ""}`} aria-labelledby="complete-title">
      <div className="success-mark" aria-hidden="true">✓</div>
      <h2 id="complete-title">{t("completeTitle")}</h2>
      <p>{t("completeText")}</p>
      <div className="action-grid">
        <button className="button button-primary" type="button" onClick={onDownloadAgain}>⬇ {t("downloadAgain")}</button>
        <button className="button button-secondary" type="button" onClick={onShare}>↗ {t("sharePdf")}</button>
        <button className="button button-secondary" type="button" onClick={onEmail}>✉ {t("emailPdf")}</button>
        <button className="button button-secondary" type="button" onClick={onWhatsapp}>💬 {t("whatsappPdf")}</button>
        <button className="button button-ghost" type="button" onClick={onPrint}>🖨 {t("printPdf")}</button>
        <button className="button button-ghost" type="button" onClick={onNewChild}>＋ {t("newChild")}</button>
      </div>
      <p className="small-note">{t("shareHint")}</p>
    </section>
  );
}
