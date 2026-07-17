import { languages } from "../data/translations.js";

export default function LanguageSelect({ t, lang, onChange }) {
  return (
    <label className="language-select">
      <span>{t("languageLabel")}</span>
      <select aria-label={t("languageGateTitle")} value={lang} onChange={(event) => onChange(event.target.value)}>
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.flag} {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}
