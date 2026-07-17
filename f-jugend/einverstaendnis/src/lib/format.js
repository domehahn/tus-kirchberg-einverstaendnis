const LOCALES = { de: "de-DE", en: "en-GB", ar: "ar", tr: "tr-TR", ru: "ru-RU", ro: "ro-RO", uk: "uk-UA" };

export function formatDate(lang, value) {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat(LOCALES[lang] || "en-GB").format(date);
}

export function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function safeFilenamePart(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function filenameForData(t, data) {
  const name = [safeFilenamePart(data.childFirstName), safeFilenamePart(data.childLastName)].filter(Boolean).join("-");
  return `${t("filenamePrefix")}${name ? `-${name}` : ""}.pdf`;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
