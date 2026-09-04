"use client";

import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createDiagnosticResult,
  diagnosticQuestions,
  DIAGNOSTIC_STORAGE_KEY,
  type DiagnosticAnswers,
  type DiagnosticResult,
} from "@/lib/diagnostic";
import { trackEvent } from "@/lib/analytics";

const PROCESSING_LINES = [
  "Lendo o seu momento.",
  "Organizando suas prioridades.",
  "Separando o que é urgente.",
  "Montando seus próximos passos.",
];

const CHECKPOINTS = [
  { emoji: "👰", label: "Seu momento" },
  { emoji: "🧭", label: "O que trava" },
  { emoji: "✅", label: "Seu andamento" },
];

type SavedDiagnostic = {
  completed: boolean;
  current: number;
  answers: DiagnosticAnswers;
  result?: DiagnosticResult;
};

const initialState: SavedDiagnostic = {
  completed: false,
  current: 0,
  answers: {},
};

export function DiagnosticExperience() {
  const [state, setState] = useState<SavedDiagnostic>(initialState);
  const [processing, setProcessing] = useState(false);
  const [processingLine, setProcessingLine] = useState(0);
  const loaded = useRef(false);
  const processingFinished = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedDiagnostic;
        setState({ ...initialState, ...parsed });
      }
    } catch {
      // O diagnóstico funciona mesmo quando o navegador bloqueia o armazenamento.
    } finally {
      loaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Sem bloqueio da experiência.
    }
  }, [state]);

  useEffect(() => {
    if (state.completed || processing) return;

    const question = diagnosticQuestions[state.current];
    trackEvent("DiagnosticQuestionView", {
      question_number: state.current + 1,
      question_id: question?.id,
    });

    const trackAbandonment = () => {
      if (document.visibilityState !== "hidden") return;
      const key = `nss_abandon_v4_${state.current + 1}`;
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
      trackEvent("DiagnosticAbandon", {
        question_number: state.current + 1,
        question_id: question?.id,
      });
    };

    document.addEventListener("visibilitychange", trackAbandonment);
    return () => document.removeEventListener("visibilitychange", trackAbandonment);
  }, [processing, state.completed, state.current]);

  useEffect(() => {
    if (!processing) return;

    const timer = window.setTimeout(() => {
      if (processingLine < PROCESSING_LINES.length - 1) {
        setProcessingLine((line) => line + 1);
        return;
      }

      if (processingFinished.current) return;
      processingFinished.current = true;

      const result = createDiagnosticResult(state.answers);
      setState((current) => ({ ...current, completed: true, result }));
      setProcessing(false);
      trackEvent("CompleteDiagnostic", {
        questions_answered: diagnosticQuestions.length,
        moment: result.momentTitle,
        priority: result.priorityTitle,
      });
      trackEvent("DiagnosticResultView", {
        moment: result.momentTitle,
        priority: result.priorityTitle,
      });
      window.dispatchEvent(new Event("nss:diagnostic-complete"));

      window.setTimeout(() => {
        document.getElementById("resultado-diagnostico")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }, 520);

    return () => window.clearTimeout(timer);
  }, [processing, processingLine, state.answers]);

  const question = diagnosticQuestions[state.current];
  const selected = question ? state.answers[question.id] : undefined;
  const progress = useMemo(
    () => ((state.current + (selected ? 1 : 0)) / diagnosticQuestions.length) * 100,
    [selected, state.current],
  );

  function choose(option: string) {
    if (!question) return;
    const firstAnswer = Object.keys(state.answers).length === 0;

    setState((current) => ({
      ...current,
      answers: { ...current.answers, [question.id]: option },
    }));

    if (firstAnswer) {
      trackEvent("StartDiagnostic", { questions_total: diagnosticQuestions.length });
    }

    trackEvent("DiagnosticAnswer", {
      question_number: state.current + 1,
      question_id: question.id,
      answer: option,
    });
  }

  function continueDiagnostic() {
    if (!selected) return;

    if (state.current === diagnosticQuestions.length - 1) {
      processingFinished.current = false;
      setProcessingLine(0);
      setProcessing(true);
      return;
    }

    setState((current) => ({ ...current, current: current.current + 1 }));
  }

  function goBack() {
    setState((current) => ({ ...current, current: Math.max(0, current.current - 1) }));
  }

  function reset() {
    try {
      window.localStorage.removeItem(DIAGNOSTIC_STORAGE_KEY);
    } catch {
      // Nada a fazer.
    }
    processingFinished.current = false;
    setProcessing(false);
    setProcessingLine(0);
    setState(initialState);
    trackEvent("RestartDiagnostic");
    window.dispatchEvent(new Event("nss:diagnostic-reset"));
    window.setTimeout(() => {
      document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  if (processing) {
    return (
      <div className="diagnostic-shell grid min-h-[390px] place-items-center" aria-live="polite">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-ink bg-sun shadow-[4px_4px_0_var(--color-ink)]">
            <Sparkles className="h-7 w-7" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-hot">
            Montando seu check-in
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-4xl">{PROCESSING_LINES[processingLine]}</h2>
          <div className="mx-auto mt-7 h-2 w-64 max-w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-hot transition-[width] duration-500"
              style={{ width: `${((processingLine + 1) / PROCESSING_LINES.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-ink/50">Usando apenas as 3 respostas que você acabou de marcar.</p>
        </div>
      </div>
    );
  }

  if (state.completed && state.result) {
    const result = state.result;

    return (
      <div className="diagnostic-shell scroll-mt-6" id="resultado-diagnostico">
        <div className="text-center">
          <span className="tag-chip bg-lime">
            <Check className="h-3.5 w-3.5" /> Seu check-in está pronto
          </span>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.17em] text-hot">Seu momento atual</p>
          <h2 className="mx-auto mt-2 max-w-3xl text-4xl font-black sm:text-6xl">{result.momentTitle}</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-ink/70">{result.description}</p>
        </div>

        <div className="mt-9 grid gap-4 lg:grid-cols-[.85fr_1.15fr]">
          <article className="result-panel bg-coral text-cream">
            <p className="result-label text-cream/70">Seu maior risco agora</p>
            <p className="mt-3 text-lg font-semibold leading-relaxed">{result.risk}</p>
          </article>

          <article className="result-panel bg-sun">
            <p className="result-label">Sua prioridade</p>
            <h3 className="mt-2 text-2xl font-black sm:text-3xl">{result.priorityTitle}</h3>
            <p className="mt-3 text-ink/70">{result.priorityExplanation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.priorityImpacts.map((impact) => (
                <span key={impact} className="rounded-full border border-ink/15 bg-white/55 px-3 py-1.5 text-sm font-bold">
                  {impact}
                </span>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <article className="result-panel bg-white">
            <p className="result-label">Seu checklist de agora</p>
            <ol className="mt-4 space-y-3">
              {result.nextSteps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-2xl bg-cream p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-hot text-sm font-black text-cream">
                    {index + 1}
                  </span>
                  <span className="font-semibold">{step}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="result-panel bg-white">
            <p className="result-label">Pode ficar para depois</p>
            <ul className="mt-4 space-y-3 text-ink/70">
              {result.canWait.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-hot" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-5 rounded-3xl bg-ink p-6 text-center text-cream sm:p-8">
          <p className="font-display text-2xl font-black sm:text-3xl">{result.reassurance}</p>
          <p className="mx-auto mt-3 max-w-2xl text-cream/65">
            O Noiva Sem Surto guarda orçamento, tarefas, fornecedores e próximos passos em uma única rota para você continuar daqui sem recomeçar do zero.
          </p>
          <a
            href="#oferta"
            className="nss-primary-btn mt-6 w-full sm:w-auto"
            onClick={() => trackEvent("OfferIntent", { placement: "diagnostic_result" })}
          >
            Quero continuar minha organização <ArrowRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={reset}
            className="mx-auto mt-5 flex items-center gap-2 text-sm font-bold text-cream/60 transition hover:text-cream"
          >
            <RotateCcw className="h-4 w-4" /> Refazer meu check-in
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="diagnostic-shell">
      <div className="mb-8 rounded-3xl border-2 border-ink bg-white p-4 shadow-[5px_5px_0_var(--color-ink)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.16em] text-hot">Seu check-in de organização</p>
            <p className="m-0 text-sm font-semibold text-ink/55">3 respostas · sem cadastro · resultado na hora</p>
          </div>
          <span className="self-start rounded-full bg-lime px-3 py-1.5 text-xs font-black sm:self-auto">
            {Math.round(progress)}% preenchido
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {CHECKPOINTS.map((step, index) => {
            const done = index < state.current || (index === state.current && Boolean(selected));
            const active = index === state.current;
            return (
              <div
                key={step.label}
                className={`rounded-2xl border p-2.5 text-center transition sm:p-3 ${
                  active ? "border-ink bg-sun/30" : "border-ink/10 bg-cream/60"
                }`}
              >
                <span className="text-lg" aria-hidden="true">{done ? "✓" : step.emoji}</span>
                <p className={`mt-1 mb-0 text-[10px] font-black sm:text-xs ${active ? "text-ink" : "text-ink/45"}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-hot">{question.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black sm:text-5xl">{question.question}</h2>
        {question.helper && <p className="mt-3 max-w-2xl text-ink/60">{question.helper}</p>}

        <div className="mt-7 grid gap-3">
          {question.options.map((option) => {
            const active = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => choose(option.value)}
                aria-pressed={active}
                className={`group flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition sm:p-5 ${
                  active
                    ? "border-ink bg-sun/25 shadow-[4px_4px_0_var(--color-ink)]"
                    : "border-ink/15 bg-white hover:border-hot/60 hover:bg-white"
                }`}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cream text-2xl sm:h-14 sm:w-14">
                  {option.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-base font-black leading-snug sm:text-lg">{option.label}</strong>
                  {option.description && (
                    <span className="mt-1 block text-sm leading-relaxed text-ink/55">{option.description}</span>
                  )}
                </span>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 ${
                    active ? "border-ink bg-lime" : "border-ink/20 bg-white"
                  }`}
                  aria-hidden="true"
                >
                  {active && <Check className="h-4 w-4" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={state.current === 0}
            className="nss-secondary-btn disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <button
            type="button"
            onClick={continueDiagnostic}
            disabled={!selected}
            className="nss-primary-btn disabled:pointer-events-none disabled:opacity-45"
          >
            {state.current === diagnosticQuestions.length - 1 ? "Ver meu checklist" : "Salvar e continuar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-center text-xs font-semibold text-ink/40">Você pode voltar e trocar qualquer resposta antes do resultado.</p>
      </div>
    </div>
  );
}
