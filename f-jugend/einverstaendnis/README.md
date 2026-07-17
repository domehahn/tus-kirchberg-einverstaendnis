# TuS Kirchberg – F-Jugend Einverständniserklärung

Datensparsame React-Webanwendung (Vite) für eine digitale Einverständniserklärung der F-Jugend.

## Eigenschaften

- Responsive Mehrschritt-Oberfläche in 7 Sprachen (Deutsch, Englisch, Arabisch, Türkisch, Russisch, Rumänisch, Ukrainisch)
- Formulardaten und Unterschrift werden ausschließlich im Browser verarbeitet
- PDF-Erzeugung ohne externe JavaScript-Abhängigkeiten (eigener minimaler PDF-Writer, dynamische Seitenanzahl)
- Leeres Papierformular als PDF
- Download, Druckansicht und Web-Share-Unterstützung
- Keine Datenbank, kein Formular-Backend, keine Cookies und kein Analytics
- Security Header für Cloudflare Pages

## Wichtiger Hinweis vor dem produktiven Einsatz

Die Einwilligungs-, Datenschutz- und Impressumstexte sind eine technische Vorlage. Sie müssen vor der Veröffentlichung durch den Verein und die zuständige Datenschutzperson auf Zweck, Rechtsgrundlage, Widerruf, Empfänger, Speicherdauer, Betroffenenrechte und die tatsächlich verwendeten Kommunikations- beziehungsweise Veröffentlichungskanäle geprüft und angepasst werden. Die Übersetzungen in die 5 zusätzlichen Sprachen sind maschinell erstellt und sollten vor dem Einsatz von Muttersprachlern geprüft werden.

Besonders die freiwilligen Foto- und Einwilligungen dürfen nicht als Voraussetzung für die Teilnahme behandelt werden. Bei einer Veröffentlichung von Kinderfotos sind die vereinsinternen Schutzkonzepte zu beachten.

## Projektstruktur

```text
src/
  App.jsx                 Zustandslogik, Schritt-Steuerung, PDF-Erzeugung
  components/             UI-Komponenten (Header, ProgressBar, Dialoge, ...)
  components/steps/       Die einzelnen Formular-Schritte
  data/config.js          Vereinsdaten, Einwilligungstexte (alle Sprachen)
  data/translations.js    UI-Übersetzungen je Sprache
  lib/pdf.js              Canvas-basierter PDF-Writer (dynamische Paginierung)
  lib/format.js           Datum/E-Mail-Validierung, Dateiname, Download-Helper
public/assets/            Vereinslogo (wird 1:1 nach dist/ kopiert)
```

## Inhalte anpassen

Vereinsdaten, Saison und Einwilligungen: `src/data/config.js`.
Oberflächentexte je Sprache: `src/data/translations.js`.

## Lokal entwickeln

```bash
npm install
npm run dev
```

Öffnet einen Dev-Server (Standard: `http://localhost:5173`).

## Produktionsbuild

```bash
npm run build
```

Erzeugt das fertige Bundle in `dist/`. Mit `npm run preview` lässt sich der Build lokal testen.

## Auf Cloudflare Pages veröffentlichen

### Git-Integration (empfohlen)

Repository mit Cloudflare Pages verbinden. Build-Einstellungen:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `f-jugend/einverstaendnis`

### Mit Wrangler

```bash
npm run build
npx wrangler pages deploy dist --project-name tus-kirchberg-fjugend-einverstaendnis
```

## Technisches Datenschutzmodell

Die CSP (`public/_headers`) verbietet Netzwerkzugriffe aus JavaScript (`connect-src 'none'`). Die Anwendung kann daher keine Formulardaten über `fetch`, XHR oder WebSockets übertragen. Davon unabhängig verarbeitet der Hosting-Anbieter beim Abruf der statischen Dateien technisch notwendige Verbindungs- und Protokolldaten.

## Browserunterstützung

Aktuelle Versionen von Chrome, Edge, Firefox und Safari. Das direkte Teilen einer PDF-Datei hängt von Browser und Betriebssystem ab. E-Mail- und WhatsApp-Links können eine lokale Datei nicht automatisch anhängen.
