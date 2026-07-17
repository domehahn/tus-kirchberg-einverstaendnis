import { config } from "../data/config.js";

export default function Footer({ t, imprintRef, notesRef, onOpenImprint, onOpenNotes, onCloseDialog }) {
  return (
    <>
      <footer className="site-footer">
        <button className="footer-link" type="button" onClick={onOpenImprint}>{t("imprint")}</button>
        <span aria-hidden="true">·</span>
        <button className="footer-link" type="button" onClick={onOpenNotes}>{t("notes")}</button>
      </footer>

      <dialog ref={imprintRef} onClick={(event) => { if (event.target === imprintRef.current) onCloseDialog(imprintRef); }}>
        <div className="dialog-header">
          <h2>{t("imprint")}</h2>
          <button className="icon-button" type="button" aria-label="Schließen" onClick={() => onCloseDialog(imprintRef)}>×</button>
        </div>
        <p>Angaben gemäß § 5 DDG:</p>
        <p>
          <strong>{config.clubName}</strong><br />
          {config.imprint.address.split(", ")[0]}<br />
          {config.imprint.address.split(", ")[1]}
        </p>
        <p>Vertretungsberechtigter / Ansprechpartner: {config.imprint.representative}</p>
        <p>Registergericht: {config.imprint.registerCourt}</p>
        <p>
          E-Mail: <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a><br />
          Web: <a href={config.website} rel="noopener" target="_blank">{config.website.replace("https://", "")}</a>
        </p>
      </dialog>

      <dialog ref={notesRef} onClick={(event) => { if (event.target === notesRef.current) onCloseDialog(notesRef); }}>
        <div className="dialog-header">
          <h2>{t("notes")}</h2>
          <button className="icon-button" type="button" aria-label="Schließen" onClick={() => onCloseDialog(notesRef)}>×</button>
        </div>
        <p>{t("notesText1")}</p>
        <p>{t("notesText2")}</p>
      </dialog>
    </>
  );
}
