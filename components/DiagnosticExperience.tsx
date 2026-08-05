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
  "Identificando sua fase.",
  "Encontrando seu maior risco.",
  "Definindo sua próxima decisão.",
  "Separando o que ainda pode esperar.",
];

type SavedDiagnostic = {
  started: boolean;
  completed: boolean;
  current: number;
  answers: DiagnosticAnswers;
  result?: DiagnosticResult;
};

const initialState: SavedDiagnostic = {
  started: false,
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
    if (!state.started || state.completed || processing) return;

    const question = diagnosticQuestions[state.current];
    trackEvent("DiagnosticQuestionView", {
      question_number: state.current + 1,
      question_id: question?.id,
    });

    const trackAbandonment = () => {
      if (document.visibilityState !== "hidden") return;
      const key = `nss_abandon_v3_${state.current + 1}`;
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
      trackEvent("DiagnosticAbandon", {
        question_number: state.current + 1,
        question_id: question?.id,
      });
    };

    document.addEventListener("visibilitychange", trackAbandonment);
    return () => document.removeEventListener("visibilitychange", trackAbandonment);
  }, [processing, state.completed, state.current, state.started]);

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
    }, 620);

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

  if (!state.started) {
    return (
      <div className="diagnostic-shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="tag-chip bg-lime">Sua Rota Sem Surto começa aqui</span>
          <h2 className="mt-5 text-3xl font-black sm:text-5xl">
            Vamos entender o momento real da sua celebração.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink/70 sm:text-lg">
            Você não precisa ter todas as respostas agora. Escolha as opções que mais combinam com o que está vivendo hoje.
          </p>
          <button type="button" onClick={start} className="nss-primary-btn mt-8 w-full sm:w-auto">
            Começar minha rota <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 text-sm font-semibold text-ink/50">3 perguntas rápidas · resultado personalizado</p>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="diagnostic-shell grid min-h-[390px] place-items-center" aria-live="polite">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-ink bg-sun">
            <Sparkles className="h-7 w-7" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-hot">
            Organizando sua Rota Sem Surto…
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-4xl">{PROCESSING_LINES[processingLine]}</h2>
          <div className="mx-auto mt-7 h-2 w-64 max-w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-hot transition-[width] duration-500"
              style={{ width: `${((processingLine + 1) / PROCESSING_LINES.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-ink/50">Análise baseada nas três respostas que você forneceu.</p>
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
            <Check className="h-3.5 w-3.5" /> Sua rota está pronta
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
            <p className="result-label">O que fazer primeiro</p>
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
            <p className="result-label">O que pode esperar</p>
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
            O Noiva Sem Surto transforma essa leitura em uma jornada completa, mostrando uma prioridade por vez até a celebração.
          </p>
          <a
            href="/checkout"
            className="nss-primary-btn mt-6 w-full sm:w-auto"
            onClick={() => trackEvent("OfferIntent", { placement: "diagnostic_result" })}
          >
            Desbloquear meu planejamento <ArrowRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={reset}
            className="mx-auto mt-5 flex items-center gap-2 text-sm font-bold text-cream/60 transition hover:text-cream"
          >
            <RotateCcw className="h-4 w-4" /> Refazer minha rota
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

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
        <p className="text-sm font-black uppercase tracking-[0.16em] text-hot">Construindo sua rota</p>
        <h2 className="mt-3 text-3xl font-black sm:text-5xl">{question.question}</h2>
        {question.helper && <p className="mt-3 text-ink/60">{question.helper}</p>}

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
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${
                    active ? "border-ink bg-lime" : "border-ink/20 bg-white"
                  }`}
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
            {state.current === diagnosticQuestions.length - 1 ? "Criar minha rota" : "Continuar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
