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
  "Analisando seu momento atual.",
  "Identificando suas prioridades.",
  "Organizando seus próximos passos.",
  "Seu diagnóstico está pronto.",
];

type SavedDiagnostic = {
  started: boolean;
  completed: boolean;
  current: number;
  answers: DiagnosticAnswers;
  result?: DiagnosticResult;
};

const initialSaved: SavedDiagnostic = {
  started: false,
  completed: false,
  current: 0,
  answers: {},
};

export function DiagnosticExperience() {
  const [state, setState] = useState<SavedDiagnostic>(initialSaved);
  const [processing, setProcessing] = useState(false);
  const [processingLine, setProcessingLine] = useState(0);
  const loaded = useRef(false);
  const completedProcessing = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
      if (stored) setState({ ...initialSaved, ...(JSON.parse(stored) as SavedDiagnostic) });
    } catch {
      // O diagnóstico continua funcionando mesmo sem armazenamento local.
    } finally {
      loaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Sem bloqueio da experiência caso o navegador impeça localStorage.
    }
  }, [state]);

  useEffect(() => {
    if (!state.started || state.completed || processing) return;

    const questionNumber = state.current + 1;
    trackEvent("DiagnosticQuestionView", {
      question_number: questionNumber,
      question_id: diagnosticQuestions[state.current]?.id,
    });

    const trackAbandon = () => {
      if (document.visibilityState !== "hidden") return;
      const key = `nss_abandon_${questionNumber}`;
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
      trackEvent("DiagnosticAbandon", {
        question_number: questionNumber,
        question_id: diagnosticQuestions[state.current]?.id,
      });
    };

    document.addEventListener("visibilitychange", trackAbandon);
    return () => document.removeEventListener("visibilitychange", trackAbandon);
  }, [processing, state.completed, state.current, state.started]);

  useEffect(() => {
    if (!processing) return;

    const timer = window.setTimeout(() => {
      if (processingLine < PROCESSING_LINES.length - 1) {
        setProcessingLine((line) => line + 1);
        return;
      }

      if (completedProcessing.current) return;
      completedProcessing.current = true;

      const result = createDiagnosticResult(state.answers);
      setState((current) => ({
        ...current,
        completed: true,
        result,
      }));
      setProcessing(false);
      trackEvent("CompleteDiagnostic", {
        profile: result.profile,
        questions_answered: diagnosticQuestions.length,
      });
      trackEvent("DiagnosticResultView", { profile: result.profile });
      window.dispatchEvent(new Event("nss:diagnostic-complete"));
    }, 650);

    return () => window.clearTimeout(timer);
  }, [processing, processingLine, state.answers]);

  const question = diagnosticQuestions[state.current];
  const selected = question ? state.answers[question.id] : undefined;
  const progress = useMemo(
    () => ((state.current + (selected ? 1 : 0)) / diagnosticQuestions.length) * 100,
    [selected, state.current],
  );

  function start() {
    setState((current) => ({ ...current, started: true }));
    trackEvent("StartDiagnostic", { questions_total: diagnosticQuestions.length });
  }

  function choose(option: string) {
    if (!question) return;
    setState((current) => ({
      ...current,
      answers: { ...current.answers, [question.id]: option },
    }));
    trackEvent("DiagnosticAnswer", {
      question_number: state.current + 1,
      question_id: question.id,
      answer: option,
    });
  }

  function continueDiagnostic() {
    if (!selected) return;
    if (state.current === diagnosticQuestions.length - 1) {
      completedProcessing.current = false;
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
    completedProcessing.current = false;
    setProcessingLine(0);
    setProcessing(false);
    setState(initialSaved);
    trackEvent("RestartDiagnostic");
  }

  if (!state.started) {
    return (
      <div className="diagnostic-shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="tag-chip bg-sun">Uma conversa rápida</span>
          <h3 className="mt-5 text-3xl font-black sm:text-5xl">Vamos entender o momento real do seu casamento.</h3>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink/70 sm:text-lg">
            Não precisa ter todas as respostas. Use o que vocês sabem hoje.
          </p>
          <button type="button" onClick={start} className="nss-primary-btn mt-8 w-full sm:w-auto">
            Começar <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-sm text-ink/50">8 perguntas · cerca de 2 minutos</p>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="diagnostic-shell min-h-[420px] grid place-items-center" aria-live="polite">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-ink bg-sun">
            <Sparkles className="h-7 w-7" />
          </div>
          <p className="mt-6 font-display text-2xl font-black sm:text-3xl">
            {PROCESSING_LINES[processingLine]}
          </p>
          <div className="mx-auto mt-6 h-2 w-64 max-w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-hot transition-[width] duration-500"
              style={{ width: `${((processingLine + 1) / PROCESSING_LINES.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-ink/50">Análise baseada somente nas respostas que você forneceu.</p>
        </div>
      </div>
    );
  }

  if (state.completed && state.result) {
    const result = state.result;
    return (
      <div className="diagnostic-shell" id="resultado-diagnostico">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <span className="tag-chip bg-lime"><Check className="h-3 w-3" /> Diagnóstico concluído</span>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-ink/50">Seu perfil</p>
            <h3 className="mt-2 text-4xl font-black text-hot sm:text-6xl">{result.profile}</h3>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/75">{result.description}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="result-panel bg-coral text-cream">
              <p className="result-label text-cream/70">Seu maior risco agora</p>
              <p className="mt-2 text-lg font-semibold">{result.risk}</p>
            </article>
            <article className="result-panel bg-sun">
              <p className="result-label">Mensagem importante</p>
              <p className="mt-2 text-lg font-semibold">{result.reassurance}</p>
            </article>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
            <article className="result-panel bg-white">
              <p className="result-label">Suas próximas três decisões</p>
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
              <p className="result-label">Pode esperar</p>
              <ul className="mt-4 space-y-3 text-ink/75">
                {result.canWait.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-hot" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-ink px-5 py-5 text-cream sm:flex-row">
            <div>
              <p className="font-display text-xl font-black">Agora você já sabe por onde continuar.</p>
              <p className="mt-1 text-sm text-cream/70">Abaixo, veja como transformar essa leitura em uma jornada completa.</p>
            </div>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-sm font-bold text-cream/75 hover:text-cream">
              <RotateCcw className="h-4 w-4" /> Refazer diagnóstico
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diagnostic-shell">
      <div className="flex items-center justify-between gap-4 text-sm font-bold text-ink/50">
        <span>Pergunta {state.current + 1} de {diagnosticQuestions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
        <div className="h-full rounded-full bg-hot transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-hot">Conversa com sua assessora</p>
        <h3 className="mt-3 text-3xl font-black sm:text-5xl">{question.question}</h3>
        <div className="mt-7 grid gap-3">
          {question.options.map((option) => {
            const active = selected === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(option)}
                aria-pressed={active}
                className={`diagnostic-option ${active ? "diagnostic-option-active" : ""}`}
              >
                <span>{option}</span>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${active ? "border-ink bg-lime" : "border-ink/20 bg-white"}`}>
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
            {state.current === diagnosticQuestions.length - 1 ? "Ver meu diagnóstico" : "Continuar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
