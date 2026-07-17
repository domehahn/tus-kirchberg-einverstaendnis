export default function ProgressBar({ t, step, total }) {
  const percent = ((step + 1) / total) * 100;
  return (
    <div className="progress-wrap" aria-label="Fortschritt">
      <div className="progress-meta">
        <span>{t("stepFormat")(step + 1, total)}</span>
        <span>{t("stepNames")[step]}</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
