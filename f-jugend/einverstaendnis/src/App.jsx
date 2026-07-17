import { useEffect, useRef, useState } from "react";
import { config } from "./data/config.js";
import { translations, languages } from "./data/translations.js";
import { createPdfBlob } from "./lib/pdf.js";
import { formatDate, isEmailValid, todayISO, filenameForData, downloadBlob } from "./lib/format.js";
import Header from "./components/Header.jsx";
import LanguageSelect from "./components/LanguageSelect.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import InfoCard from "./components/InfoCard.jsx";
import Toast from "./components/Toast.jsx";
import Footer from "./components/Footer.jsx";
import CompleteStep from "./components/CompleteStep.jsx";
import StepIntro from "./components/steps/StepIntro.jsx";
import StepPrivacy from "./components/steps/StepPrivacy.jsx";
import StepChild from "./components/steps/StepChild.jsx";
import StepGuardian from "./components/steps/StepGuardian.jsx";
import StepConsents from "./components/steps/StepConsents.jsx";
import StepSignature from "./components/steps/StepSignature.jsx";

const TOTAL_STEPS = 6;

const defaultFields = {
  childLastName: "",
  childFirstName: "",
  birthDate: "",
  squad: "",
  guardianLastName: "",
  guardianFirstName: "",
  email: "",
  phone: "",
  place: "Kirchberg",
  signatureDate: todayISO()
};

function defaultConsentChecked() {
  return Object.fromEntries(config.consents.map((consent) => [consent.id, false]));
}

export default function App() {
  const [lang, setLang] = useState("de");
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [logoImg, setLogoImg] = useState(null);
  const [fields, setFields] = useState(defaultFields);
  const [consentChecked, setConsentChecked] = useState(defaultConsentChecked);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [signatureStarted, setSignatureStarted] = useState(false);
  const [attemptedSteps, setAttemptedSteps] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [blankBusy, setBlankBusy] = useState(false);
  const [lastPdf, setLastPdf] = useState(null);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const toastTimerRef = useRef(null);
  const lastPdfUrlRef = useRef(null);
  const imprintRef = useRef(null);
  const notesRef = useRef(null);

  const t = (key) => translations[lang]?.[key] ?? key;

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogoImg(img);
    img.src = "/assets/tus-logo.png";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#152033";
    ctx.lineWidth = 5;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = languages.find((item) => item.code === lang)?.rtl ? "rtl" : "ltr";
    document.title = `${config.clubName} · ${t("headerSubtitle")}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  function showToast(message) {
    setToastMsg(message);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 3600);
  }

  function updateField(name, value) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function toggleConsent(id, checked) {
    setConsentChecked((prev) => ({ ...prev, [id]: checked }));
  }

  function computeStepErrors(idx) {
    const errors = {};
    if (idx === 1) {
      errors.privacyAccepted = !privacyAccepted;
    } else if (idx === 2) {
      errors.childLastName = !fields.childLastName.trim();
      errors.childFirstName = !fields.childFirstName.trim();
      errors.birthDate = !fields.birthDate;
    } else if (idx === 3) {
      errors.guardianLastName = !fields.guardianLastName.trim();
      errors.guardianFirstName = !fields.guardianFirstName.trim();
      errors.email = !fields.email.trim() || !isEmailValid(fields.email);
      errors.phone = !fields.phone.trim();
    } else if (idx === 4) {
      for (const consent of config.consents) {
        if (consent.required) errors[`consent_${consent.id}`] = !consentChecked[consent.id];
      }
    } else if (idx === 5) {
      errors.place = !fields.place.trim();
      errors.signatureDate = !fields.signatureDate;
      errors.signature = !signatureStarted;
    }
    return errors;
  }

  function stepIsValid(idx) {
    return Object.values(computeStepErrors(idx)).every((invalid) => !invalid);
  }

  function goNext() {
    if (stepIsValid(step)) {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    } else {
      setAttemptedSteps((prev) => ({ ...prev, [step]: true }));
      showToast(t("validationToast"));
    }
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function errorsForStep(idx) {
    return attemptedSteps[idx] ? computeStepErrors(idx) : {};
  }

  function canvasPoint(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function handlePointerDown(event) {
    event.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = canvasPoint(event);
    canvasRef.current.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!drawingRef.current) return;
    event.preventDefault();
    const point = canvasPoint(event);
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
    if (!signatureStarted) setSignatureStarted(true);
  }

  function handlePointerUp(event) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    canvasRef.current.releasePointerCapture?.(event.pointerId);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureStarted(false);
  }

  function buildFormData() {
    return {
      ...fields,
      consents: config.consents.map((consent) => ({ ...consent, checked: Boolean(consentChecked[consent.id]) }))
    };
  }

  async function handleBlankPdf() {
    setBlankBusy(true);
    try {
      const emptyData = {
        childFirstName: "", childLastName: "", birthDate: "", squad: "",
        guardianFirstName: "", guardianLastName: "", email: "", phone: "",
        place: "", signatureDate: "",
        consents: config.consents.map((consent) => ({ ...consent, checked: false }))
      };
      const blob = await createPdfBlob({
        blank: true,
        data: emptyData,
        logo: logoImg,
        t,
        lang,
        formatDate: (value) => formatDate(lang, value),
        signatureCanvas: canvasRef.current,
        signatureStarted: false
      });
      downloadBlob(blob, t("blankFilename"));
      showToast(t("pdfCreated"));
    } catch (error) {
      console.error(error);
      showToast(t("pdfError"));
    } finally {
      setBlankBusy(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (honeypot) return;
    if (!stepIsValid(5)) {
      setAttemptedSteps((prev) => ({ ...prev, 5: true }));
      showToast(t("validationToast"));
      return;
    }
    setSubmitting(true);
    try {
      const data = buildFormData();
      const blob = await createPdfBlob({
        blank: false,
        data,
        logo: logoImg,
        t,
        lang,
        formatDate: (value) => formatDate(lang, value),
        signatureCanvas: canvasRef.current,
        signatureStarted
      });
      const filename = filenameForData(t, data);
      setLastPdf({ blob, filename });
      downloadBlob(blob, filename);
      showToast(t("pdfCreated"));
      setCompleted(true);
    } catch (error) {
      console.error(error);
      showToast(t("pdfError"));
    } finally {
      setSubmitting(false);
    }
  }

  function handleDownloadAgain() {
    if (lastPdf) downloadBlob(lastPdf.blob, lastPdf.filename);
  }

  async function handleShare() {
    if (!lastPdf) return;
    const file = new File([lastPdf.blob], lastPdf.filename, { type: "application/pdf" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ title: t("emailSubject"), text: t("emailSubject"), files: [file] });
      } catch (error) {
        if (error?.name !== "AbortError") showToast(t("shareCancelled"));
      }
    } else {
      downloadBlob(lastPdf.blob, lastPdf.filename);
      showToast(t("shareUnsupported"));
    }
  }

  function handleEmail() {
    window.location.href = `mailto:${encodeURIComponent(config.contactEmail)}?subject=${encodeURIComponent(t("emailSubject"))}&body=${encodeURIComponent(t("emailBody"))}`;
  }

  function handleWhatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(t("whatsappBody"))}`, "_blank", "noopener");
  }

  function handlePrint() {
    if (!lastPdf) return;
    if (lastPdfUrlRef.current) URL.revokeObjectURL(lastPdfUrlRef.current);
    lastPdfUrlRef.current = URL.createObjectURL(lastPdf.blob);
    window.open(lastPdfUrlRef.current, "_blank", "noopener");
  }

  function handleNewChild() {
    setFields(defaultFields);
    setConsentChecked(defaultConsentChecked());
    setPrivacyAccepted(false);
    setHoneypot("");
    setAttemptedSteps({});
    clearSignature();
    setLastPdf(null);
    setCompleted(false);
    setStep(0);
  }

  function openDialog(ref) {
    ref.current?.showModal();
  }

  function closeDialog(ref) {
    ref.current?.close();
  }

  return (
    <>
      <a className="skip-link" href="#main">Zum Formular springen</a>

      <Header t={t} />

      <main id="main" className="page-shell">
        <section className="card form-card" aria-labelledby="page-title">
          <div className="top-row">
            <div>
              <p className="eyebrow">{t("seasonLabel")}</p>
              <h1 id="page-title">{t("pageTitle")}</h1>
            </div>
            <LanguageSelect t={t} lang={lang} onChange={setLang} />
          </div>

          {!completed && <ProgressBar t={t} step={step} total={TOTAL_STEPS} />}

          <form onSubmit={handleSubmit} noValidate hidden={completed}>
            <StepIntro
              t={t}
              active={step === 0}
              onNext={goNext}
              onBlankPdf={handleBlankPdf}
              blankBusy={blankBusy}
            />
            <StepPrivacy
              t={t}
              active={step === 1}
              privacyAccepted={privacyAccepted}
              onChangePrivacy={setPrivacyAccepted}
              showError={Boolean(errorsForStep(1).privacyAccepted)}
              onBack={goBack}
              onNext={goNext}
            />
            <StepChild
              t={t}
              active={step === 2}
              fields={fields}
              onChange={updateField}
              errors={errorsForStep(2)}
              onBack={goBack}
              onNext={goNext}
            />
            <StepGuardian
              t={t}
              active={step === 3}
              fields={fields}
              onChange={updateField}
              errors={errorsForStep(3)}
              onBack={goBack}
              onNext={goNext}
            />
            <StepConsents
              t={t}
              lang={lang}
              active={step === 4}
              consentChecked={consentChecked}
              onToggle={toggleConsent}
              errors={errorsForStep(4)}
              onBack={goBack}
              onNext={goNext}
            />
            <StepSignature
              t={t}
              lang={lang}
              active={step === 5}
              fields={fields}
              onChange={updateField}
              errors={errorsForStep(5)}
              consentChecked={consentChecked}
              canvasRef={canvasRef}
              signatureStarted={signatureStarted}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClearSignature={clearSignature}
              honeypot={honeypot}
              onHoneypotChange={setHoneypot}
              onBack={goBack}
              submitting={submitting}
            />
          </form>

          <CompleteStep
            t={t}
            active={completed}
            onDownloadAgain={handleDownloadAgain}
            onShare={handleShare}
            onEmail={handleEmail}
            onWhatsapp={handleWhatsapp}
            onPrint={handlePrint}
            onNewChild={handleNewChild}
          />
        </section>

        <InfoCard t={t} />
      </main>

      <Footer
        t={t}
        imprintRef={imprintRef}
        notesRef={notesRef}
        onOpenImprint={() => openDialog(imprintRef)}
        onOpenNotes={() => openDialog(notesRef)}
        onCloseDialog={closeDialog}
      />

      <Toast message={toastMsg} />
    </>
  );
}
