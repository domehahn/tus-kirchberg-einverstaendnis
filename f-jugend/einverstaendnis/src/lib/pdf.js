import { config } from "../data/config.js";

function wrapText(ctx, text, maxWidth) {
  const paragraphs = String(text ?? "").split(/\n/);
  const lines = [];
  for (const paragraph of paragraphs) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    const words = paragraph.split(/\s+/);
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width <= maxWidth || !line) {
        line = test;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function drawWrapped(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = wrapText(ctx, text, maxWidth);
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

function createPageCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1754;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return { canvas, ctx };
}

function drawPdfHeader(ctx, pageNo, totalPages, blank, logo, t) {
  ctx.fillStyle = "#e4002b";
  ctx.fillRect(0, 0, 1240, 24);
  ctx.fillStyle = "#ffd200";
  ctx.fillRect(0, 24, 1240, 9);
  const textX = logo ? 194 : 90;
  if (logo) ctx.drawImage(logo, 90, 95, 84, 90);
  ctx.fillStyle = "#e4002b";
  ctx.font = "700 34px Arial, sans-serif";
  ctx.fillText(config.clubName, textX, 102);
  ctx.fillStyle = "#18202b";
  ctx.font = "700 48px Arial, sans-serif";
  ctx.fillText(t("pdfTitle"), textX, 166);
  ctx.fillStyle = "#627083";
  ctx.font = "25px Arial, sans-serif";
  ctx.fillText(`${t("seasonLabel")} · ${blank ? t("blankPdfNote") : ""}`, textX, 207);
  ctx.textAlign = "right";
  ctx.font = "22px Arial, sans-serif";
  ctx.fillText(`${pageNo}/${totalPages}`, 1150, 102);
  ctx.textAlign = "left";
  ctx.strokeStyle = "#dce2e9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, 235);
  ctx.lineTo(1150, 235);
  ctx.stroke();
}

function drawSectionTitle(ctx, title, y) {
  ctx.fillStyle = "#e4002b";
  ctx.font = "700 29px Arial, sans-serif";
  ctx.fillText(title, 90, y);
  return y + 38;
}

function drawField(ctx, label, value, x, y, width, blank = false) {
  ctx.fillStyle = "#627083";
  ctx.font = "700 19px Arial, sans-serif";
  ctx.fillText(label, x, y);
  ctx.fillStyle = "#18202b";
  ctx.font = "25px Arial, sans-serif";
  if (!blank && value) ctx.fillText(String(value), x, y + 36);
  ctx.strokeStyle = "#aebac8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 49);
  ctx.lineTo(x + width, y + 49);
  ctx.stroke();
}

function drawCheckbox(ctx, checked, x, y) {
  ctx.strokeStyle = "#566477";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, 25, 25);
  if (checked) {
    ctx.strokeStyle = "#e4002b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 12);
    ctx.lineTo(x + 11, y + 19);
    ctx.lineTo(x + 22, y + 5);
    ctx.stroke();
  }
}

const CONTENT_TOP = 292;
const CONTENT_BOTTOM = 1620;

function buildPdfCanvases(data, blank, logo, t, lang, formatDate, signatureCanvas, signatureStarted) {
  const pages = [createPageCanvas()];
  let page = pages[0];
  let y = CONTENT_TOP;

  function ensureSpace(height) {
    if (y + height > CONTENT_BOTTOM) {
      page = createPageCanvas();
      pages.push(page);
      y = CONTENT_TOP;
    }
  }

  ensureSpace(190);
  y = drawSectionTitle(page.ctx, t("reviewChild"), y);
  drawField(page.ctx, t("firstName"), data.childFirstName, 90, y, 480, blank);
  drawField(page.ctx, t("lastName"), data.childLastName, 650, y, 500, blank);
  y += 105;
  drawField(page.ctx, t("birthDate"), formatDate(data.birthDate), 90, y, 480, blank);
  drawField(page.ctx, t("squad"), data.squad, 650, y, 500, blank);
  y += 145;

  ensureSpace(190);
  y = drawSectionTitle(page.ctx, t("reviewGuardian"), y);
  drawField(page.ctx, t("firstName"), data.guardianFirstName, 90, y, 480, blank);
  drawField(page.ctx, t("lastName"), data.guardianLastName, 650, y, 500, blank);
  y += 105;
  drawField(page.ctx, t("email"), data.email, 90, y, 480, blank);
  drawField(page.ctx, t("phone"), data.phone, 650, y, 500, blank);
  y += 150;

  ensureSpace(60);
  y = drawSectionTitle(page.ctx, t("reviewConsents"), y);
  for (const consent of data.consents) {
    page.ctx.fillStyle = "#18202b";
    page.ctx.font = "22px Arial, sans-serif";
    const suffix = consent.required ? ` (${t("requiredMark")})` : "";
    const text = `${consent[lang]}${suffix}`;
    const lines = wrapText(page.ctx, text, 990);
    ensureSpace(lines.length * 31 + 24);
    page.ctx.fillStyle = "#18202b";
    page.ctx.font = "22px Arial, sans-serif";
    drawCheckbox(page.ctx, blank ? false : consent.checked, 92, y - 21);
    y = drawWrapped(page.ctx, text, 135, y, 990, 31) + 22;
  }

  ensureSpace(490);
  y = drawSectionTitle(page.ctx, t("signatureLegend"), y);
  drawField(page.ctx, t("place"), data.place, 90, y, 480, blank);
  drawField(page.ctx, t("date"), formatDate(data.signatureDate), 650, y, 500, blank);
  y += 120;
  page.ctx.strokeStyle = "#9da9b8";
  page.ctx.setLineDash([12, 8]);
  page.ctx.strokeRect(90, y, 1060, 250);
  page.ctx.setLineDash([]);
  if (!blank && signatureStarted) {
    page.ctx.drawImage(signatureCanvas, 135, y + 28, 970, 185);
  } else {
    page.ctx.fillStyle = "#7c8999";
    page.ctx.font = "22px Arial, sans-serif";
    page.ctx.fillText(t("signaturePlaceholder"), 135, y + 125);
  }
  y += 300;

  ensureSpace(140);
  page.ctx.fillStyle = "#18202b";
  page.ctx.font = "700 23px Arial, sans-serif";
  page.ctx.fillText(t("privacyTitle"), 90, y);
  page.ctx.fillStyle = "#4d5a6a";
  page.ctx.font = "20px Arial, sans-serif";
  y = drawWrapped(page.ctx, t("pdfPrivacy"), 90, y + 36, 1060, 29) + 18;
  y = drawWrapped(page.ctx, t("pdfLegalNote"), 90, y, 1060, 29);

  ensureSpace(60);
  page.ctx.strokeStyle = "#dce2e9";
  page.ctx.beginPath();
  page.ctx.moveTo(90, y + 15);
  page.ctx.lineTo(1150, y + 15);
  page.ctx.stroke();
  page.ctx.fillStyle = "#627083";
  page.ctx.font = "18px Arial, sans-serif";
  page.ctx.fillText(`${config.clubName} · ${config.imprint.address} · ${config.contactEmail}`, 90, y + 45);

  pages.forEach((p, i) => drawPdfHeader(p.ctx, i + 1, pages.length, blank, logo, t));

  return pages.map((p) => p.canvas);
}

function dataUrlToBytes(dataUrl) {
  const binary = atob(dataUrl.split(",")[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function asciiBytes(text) {
  return new TextEncoder().encode(text);
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

function buildPdfFromCanvases(canvases) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const pageCount = canvases.length;
  const objectCount = 2 + pageCount * 3;
  const objects = new Array(objectCount + 1);

  objects[1] = [asciiBytes("<< /Type /Catalog /Pages 2 0 R >>")];
  const kids = canvases.map((_, i) => `${3 + i * 3} 0 R`).join(" ");
  objects[2] = [asciiBytes(`<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`)];

  canvases.forEach((canvas, i) => {
    const pageObj = 3 + i * 3;
    const contentObj = pageObj + 1;
    const imageObj = pageObj + 2;
    const imageName = `Im${i + 1}`;
    const jpeg = dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.92));
    const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/${imageName} Do\nQ\n`;
    objects[pageObj] = [asciiBytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /${imageName} ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>`)];
    objects[contentObj] = [asciiBytes(`<< /Length ${asciiBytes(content).length} >>\nstream\n`), asciiBytes(content), asciiBytes("endstream")];
    objects[imageObj] = [
      asciiBytes(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),
      jpeg,
      asciiBytes("\nendstream")
    ];
  });

  const header = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10, 37, 226, 227, 207, 211, 10]);
  const parts = [header];
  const offsets = new Array(objectCount + 1).fill(0);
  let cursor = header.length;

  for (let i = 1; i <= objectCount; i += 1) {
    offsets[i] = cursor;
    const start = asciiBytes(`${i} 0 obj\n`);
    const end = asciiBytes("\nendobj\n");
    parts.push(start, ...objects[i], end);
    cursor += start.length + objects[i].reduce((sum, p) => sum + p.length, 0) + end.length;
  }

  const xrefOffset = cursor;
  let xref = `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objectCount; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `${xref}trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(asciiBytes(trailer));
  return new Blob([concatBytes(parts)], { type: "application/pdf" });
}

export async function createPdfBlob({ blank, data, logo, t, lang, formatDate, signatureCanvas, signatureStarted }) {
  const canvases = buildPdfCanvases(data, blank, logo, t, lang, formatDate, signatureCanvas, signatureStarted);
  return buildPdfFromCanvases(canvases);
}
