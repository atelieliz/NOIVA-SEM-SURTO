"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { appendTrackingParams, mergeTrackingParams } from "@/lib/tracking.mjs";

const CHECKOUT_URL = "https://pay.kiwify.com.br/AUehsBX";
const TRACKING_STORAGE_KEY = "nss_landing_tracking";
const RESULT_STORAGE_KEY = "nss_landing_result_v4";
const PRICE = 14.99;

const QUESTIONS = [
  {
    eyebrow: "1 · SEU MOMENTO",
    title: "Qual dessas frases parece mais com você hoje?",
    helper: "Não precisa ter tudo decidido. Marque apenas a opção que melhor descreve seu momento.",
    options: [
      {
        value: "Meu casamento.",
        emoji: "👰",
        label: "Sou a noiva",
        description: "Meu casamento já faz parte da minha realidade e eu quero organizar as decisões sem me perder.",
      },
      {
        value: "Ainda estamos decidindo o formato.",
        emoji: "💍",
        label: "Ainda não estou noiva, mas já quero me organizar",
        description: "Quero entender o que faz sentido antes de começar a gastar, pesquisar e decidir.",
      },
      {
        value: "Bodas ou renovação de votos.",
        emoji: "🥂",
        label: "Minhas bodas merecem organização",
        description: "Quero celebrar nossa história com carinho, estrutura e sem transformar tudo em correria.",
      },
    ],
  },
  {
    eyebrow: "2 · SUA PRIORIDADE",
    title: "O que mais está te deixando perdida agora?",
    helper: "Escolha só uma. A ideia é descobrir qual decisão merece sua atenção primeiro.",
    options: [
      {
        value: "Não sei por onde começar.",
        emoji: "🧭",
        label: "Não sei por onde começar",
        description: "Tem tanta coisa para pensar que eu não sei qual decisão vem primeiro.",
      },
      {
        value: "Tenho medo de gastar mais do que podemos.",
        emoji: "💸",
        label: "Tenho medo de gastar mais do que deveria",
        description: "Quero organizar o sonho sem perder o controle do orçamento.",
      },
      {
        value: "A lista de convidados está virando um problema.",
        emoji: "👥",
        label: "A lista de convidados está me travando",
        description: "Não sei quem chamar, quantas pessoas considerar ou como isso afeta o restante.",
      },
      {
        value: "Não sei quais fornecedores contratar primeiro.",
        emoji: "🤝",
        label: "Não sei o que contratar primeiro",
        description: "Estou vendo fornecedores, mas não sei qual contratação realmente precisa acontecer agora.",
      },
      {
        value: "Tenho muitas ideias, mas nenhum plano.",
        emoji: "📌",
        label: "Tenho muitas ideias, mas nada organizado",
        description: "Salvei referências e possibilidades, mas ainda não consegui transformar isso em um plano.",
      },
      {
        value: "Estou organizando praticamente tudo sozinha.",
        emoji: "🙋‍♀️",
        label: "Estou organizando praticamente tudo sozinha",
        description: "As decisões e informações estão ficando concentradas demais em mim.",
      },
    ],
  },
  {
    eyebrow: "3 · SEU ANDAMENTO",
    title: "O que já está encaminhado hoje?",
    helper: "Isso ajuda o Noiva Sem Surto a separar o que é prioridade do que ainda pode esperar.",
    options: [
      {
        value: "Ainda é uma ideia, sem data definida.",
        emoji: "🌱",
        label: "Ainda estou no começo",
        description: "Tenho o desejo, mas ainda não existe uma base clara ou uma data definida.",
      },
      {
        value: "Já temos uma data, mas quase nada organizado.",
        emoji: "📅",
        label: "Já temos uma data",
        description: "A data existe, mas ainda falta transformar isso em uma sequência de decisões.",
      },
      {
        value: "Já começamos a pesquisar e pedir orçamentos.",
        emoji: "🔎",
        label: "Já estou pesquisando e pedindo orçamentos",
        description: "Já comecei a olhar possibilidades, valores e fornecedores.",
      },
      {
        value: "Já contratamos algumas coisas, mas falta controle.",
        emoji: "✅",
        label: "Já temos algumas coisas resolvidas",
        description: "Algumas decisões foram tomadas, mas eu preciso enxergar melhor o que ainda falta.",
      },
      {
        value: "Faltam poucos meses e estamos atrasados.",
        emoji: "⏰",
        label: "Faltam poucos meses e ainda há pendências",
        description: "Agora eu preciso saber o que é realmente urgente para não gastar energia no lugar errado.",
      },
    ],
  },
];

const CHECKPOINTS = [
  { emoji: "👰", label: "Seu momento" },
  { emoji: "🧭", label: "O que trava" },
  { emoji: "✅", label: "Seu andamento" },
];

const PAIN_ROUTES = {
  "Não sei por onde começar.": {
    risk: "pesquisar detalhes antes de definir a estrutura que sustenta as outras escolhas.",
    priority: "Criar a base real da celebração",
    reason:
      "Valor possível, convidados e formato são as decisões que dão direção a orçamento, local e fornecedores.",
    first: [
      "Definir, em casal, o valor possível para a celebração.",
      "Estimar os convidados por família ou grupo.",
      "Escolher o formato e o tamanho aproximado do momento.",
    ],
    wait: ["lembranças", "papelaria complementar", "atrações extras", "detalhes decorativos"],
  },
  "Tenho medo de gastar mais do que podemos.": {
    risk: "pedir orçamentos sem um limite claro e escolher pelo susto, não pela prioridade.",
    priority: "Transformar desejo em um valor possível",
    reason:
      "Um limite decidido em casal ajuda a comparar escolhas, ajustar convidados e saber onde vale investir mais.",
    first: [
      "Conversar em casal sobre o valor total possível.",
      "Separar o que é prioridade do que pode ser adaptado.",
      "Estimar convidados antes de comparar espaços e buffet.",
    ],
    wait: ["itens extras de decoração", "lembranças", "papelaria adicional", "upgrades sem orçamento"],
  },
  "A lista de convidados está virando um problema.": {
    risk: "tratar cada nome isoladamente e perder a noção do impacto de famílias e grupos no orçamento.",
    priority: "Estimar convidados por família ou grupo",
    reason:
      "A quantidade prevista orienta espaço, buffet e investimento. Famílias maiores entram com a quantidade real, não como um único nome.",
    first: [
      "Criar os grupos principais: família, amigos e pessoas essenciais.",
      "Registrar cada família com a quantidade prevista de convidados.",
      "Comparar o total com o formato e o valor possível.",
    ],
    wait: ["posição nas mesas", "convites individuais", "lembranças", "confirmação final de presença"],
  },
  "Não sei quais fornecedores contratar primeiro.": {
    risk: "comparar propostas diferentes sem critérios comuns e contratar o que parece urgente.",
    priority: "Definir critérios antes de pedir novos orçamentos",
    reason:
      "Com formato, quantidade e valor em mãos, fica mais simples comparar fornecedores e decidir a ordem das contratações.",
    first: [
      "Confirmar formato, estimativa de convidados e limite de investimento.",
      "Escolher a próxima categoria que destrava outras decisões.",
      "Comparar propostas com os mesmos critérios, lado a lado.",
    ],
    wait: ["fornecedores extras", "personalizações", "detalhes estéticos", "itens sem impacto na estrutura"],
  },
  "Tenho muitas ideias, mas nenhum plano.": {
    risk: "tentar encaixar todas as referências antes de escolher o que realmente representa vocês.",
    priority: "Transformar referências em prioridades",
    reason:
      "Quando o casal define o que é essencial, as ideias deixam de competir e começam a formar uma rota possível.",
    first: [
      "Escolher três sensações que a celebração deve transmitir.",
      "Definir o que é indispensável para o casal.",
      "Conectar essas prioridades ao valor, convidados e formato.",
    ],
    wait: ["tendências", "detalhes de inspiração", "compras por impulso", "itens que não representam o casal"],
  },
  "Estou organizando praticamente tudo sozinha.": {
    risk: "acumular decisões sem deixar claro quem participa, aprova ou executa cada etapa.",
    priority: "Dividir as primeiras responsabilidades com clareza",
    reason:
      "As decisões centrais começam em casal; depois, cada tarefa pode ter uma pessoa responsável e um próximo passo visível.",
    first: [
      "Definir em casal o valor possível da celebração.",
      "Estimar em casal o número de convidados.",
      "Decidir juntos o formato antes de dividir as próximas tarefas.",
    ],
    wait: ["tarefas sem prazo", "opiniões externas", "detalhes não prioritários", "decisões que dependem da base"],
  },
};

const STAGE_COPY = {
  "Ainda é uma ideia, sem data definida.": {
    title: "Sua celebração precisa de uma base antes das pesquisas",
    text: "Não ter uma data ainda não impede o começo. Primeiro, vocês precisam entender tamanho, valor possível e formato para que a data nasça de uma escolha viável.",
  },
  "Já temos uma data, mas quase nada organizado.": {
    title: "Data definida, mas planejamento sem direção",
    text: "A data já cria um prazo real. Agora as escolhas precisam entrar em uma sequência que proteja tempo, orçamento e energia.",
  },
  "Já começamos a pesquisar e pedir orçamentos.": {
    title: "As pesquisas começaram; agora é hora de criar critérios",
    text: "Receber propostas não significa que a próxima decisão ficou clara. A rota precisa organizar o que comparar, o que decidir e o que ainda pode esperar.",
  },
  "Já contratamos algumas coisas, mas falta controle.": {
    title: "Já existem escolhas; agora falta enxergar o todo",
    text: "O próximo passo é reunir o que foi decidido, identificar dependências e impedir que tarefas importantes desapareçam entre os detalhes.",
  },
  "Faltam poucos meses e estamos atrasados.": {
    title: "O prazo encurtou: sua rota precisa priorizar o essencial",
    text: "Nem tudo tem a mesma urgência. O foco agora é proteger o que sustenta a celebração e simplificar o que não precisa carregar o mesmo peso.",
  },
  "Estamos reorganizando tudo para bodas ou renovação.": {
    title: "Uma nova celebração merece uma rota feita para este momento",
    text: "Bodas e renovação não precisam repetir um casamento. A organização deve partir do significado atual, das pessoas presentes e do formato que faz sentido agora.",
  },
};

const VALUE_POINTS = [
  {
    number: "01",
    title: "Abra e saiba o que resolver agora",
    text: "A rota coloca uma prioridade visível na sua frente para você não tentar decidir tudo ao mesmo tempo.",
  },
  {
    number: "02",
    title: "Resolva sem começar do zero",
    text: "Convidados, orçamento, fornecedores e responsabilidades ficam conectados ao planejamento.",
  },
  {
    number: "03",
    title: "Terminou? Continue pela próxima decisão",
    text: "O Noiva Sem Surto existe para ser o lugar ao qual você volta quando surgir o próximo “e agora?”.",
  },
];

const INCLUDED = [
  "Bússola Sem Surto para enxergar a próxima prioridade",
  "Organização de orçamento e valor possível",
  "Lista de convidados por pessoas, famílias e grupos",
  "Estrutura para comparar fornecedores e decisões",
  "Responsabilidades mais claras entre as etapas",
  "Planejamento de cerimônia, recepção e reta final",
];

const FAQS = [
  {
    question: "O diagnóstico é gratuito?",
    answer:
      "Sim. As três perguntas e a rota inicial são gratuitas. A compra é opcional e libera a experiência completa do Noiva Sem Surto.",
  },
  {
    question: "Por que comprar se o diagnóstico já mostrou meu próximo passo?",
    answer:
      "Porque o diagnóstico mostra a primeira prioridade. Depois dela surgem novas decisões. O Noiva Sem Surto organiza a sequência e te dá um lugar para continuar sem voltar à sensação de não saber por onde começar.",
  },
  {
    question: "Eu já tenho listas e planilhas. Não é a mesma coisa?",
    answer:
      "Não. Uma lista mostra tudo o que existe para fazer. A proposta do Noiva Sem Surto é ajudar a enxergar a ordem: o que faz sentido resolver agora, o que vem depois e o que pode esperar.",
  },
  {
    question: "E se eu já tiver começado a organizar?",
    answer:
      "Você não precisa começar de novo. A ferramenta ajuda a reunir o que já foi decidido e continuar a partir da fase em que você está.",
  },
  {
    question: "É fácil de usar no celular?",
    answer:
      "Sim. O acesso é pelo navegador do celular ou computador, sem precisar instalar um aplicativo.",
  },
  {
    question: "Substitui uma assessoria presencial?",
    answer:
      "Não. O Noiva Sem Surto funciona como uma assessora digital para organizar prioridades, decisões e informações. A execução presencial continua dependendo dos profissionais contratados.",
  },
  {
    question: "Como funciona o acesso e a garantia?",
    answer:
      "O pagamento é processado pela Kiwify. O acesso e as condições de garantia válidas são as exibidas no checkout no momento da compra.",
  },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function trackEvent(name, payload = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", name, payload);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
  } catch {
    // A experiência continua mesmo se um bloqueador impedir analytics.
  }
}

function saveTrackingParams() {
  const merged = mergeTrackingParams(
    window.location.search,
    window.sessionStorage.getItem(TRACKING_STORAGE_KEY) || "",
  );
  window.sessionStorage.setItem(TRACKING_STORAGE_KEY, merged);
  return merged;
}

function createCheckoutUrl() {
  return appendTrackingParams(CHECKOUT_URL, saveTrackingParams());
}

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Noiva Sem Surto — início">
      <span className="brandMark" aria-hidden="true">N</span>
      <span>Noiva Sem Surto</span>
    </a>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

function CheckoutButton({ className, children, busy, href, onClick }) {
  return (
    <a
      className={cx("primaryButton", className, busy && "isBusy")}
      href={href}
      onClick={onClick}
      aria-disabled={busy}
    >
      <span>{busy ? "ABRINDO PAGAMENTO…" : children}</span>
      {!busy && <ArrowIcon />}
    </a>
  );
}

function Progress({ current }) {
  return (
    <div className="progress" aria-label={`Pergunta ${current + 1} de 3`}>
      {QUESTIONS.map((_, index) => (
        <span key={index} className={cx(index <= current && "active")} />
      ))}
    </div>
  );
}

export default function Home() {
  const [started, setStarted] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([null, null, null]);
  const [result, setResult] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [checkoutHref, setCheckoutHref] = useState(CHECKOUT_URL);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const checkoutLock = useRef(false);

  useEffect(() => {
    setCheckoutHref(createCheckoutUrl());
    const stored = window.localStorage.getItem(RESULT_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.answers) && parsed.answers.length === 3) {
        setAnswers(parsed.answers);
        setResult(parsed);
      }
    } catch {
      window.localStorage.removeItem(RESULT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!started || result || isBuilding) return undefined;
    trackEvent("DiagnosticQuestionView", {
      question_number: step + 1,
      question: QUESTIONS[step].title,
    });

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        trackEvent("DiagnosticAbandon", { question_number: step + 1 });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [started, step, result, isBuilding]);

  const selected = answers[step];
  const completion = Math.round(((step + (selected ? 1 : 0)) / QUESTIONS.length) * 100);

  const route = useMemo(() => {
    if (!result) return null;
    const pain = PAIN_ROUTES[result.answers[1]] || PAIN_ROUTES[QUESTIONS[1].options[0].value];
    const stage = STAGE_COPY[result.answers[2]] || STAGE_COPY[QUESTIONS[2].options[0].value];
    return { pain, stage };
  }, [result]);

  function startDiagnosis() {
    setStarted(true);
    trackEvent("DiagnosticIntent", { questions_total: QUESTIONS.length });
    window.requestAnimationFrame(() => {
      document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleHeroAction() {
    if (!result) {
      startDiagnosis();
      return;
    }
    document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectOption(option) {
    if (answers.every((value) => value === null)) {
      trackEvent("StartDiagnostic", { questions_total: QUESTIONS.length });
    }
    setAnswers((current) => current.map((value, index) => (index === step ? option.value : value)));
    trackEvent("DiagnosticAnswer", { question_number: step + 1, answer: option.value });
  }

  function continueDiagnosis() {
    if (!selected) return;
    if (step < QUESTIONS.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setIsBuilding(true);
    window.setTimeout(() => {
      const nextResult = { answers, createdAt: Date.now() };
      window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(nextResult));
      setResult(nextResult);
      setIsBuilding(false);
      trackEvent("CompleteDiagnostic", {
        questions_answered: QUESTIONS.length,
        pain: answers[1],
        stage: answers[2],
      });
      window.requestAnimationFrame(() => {
        document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 850);
  }

  function restartDiagnosis() {
    window.localStorage.removeItem(RESULT_STORAGE_KEY);
    setAnswers([null, null, null]);
    setStep(0);
    setResult(null);
    setStarted(true);
    trackEvent("RestartDiagnostic");
    window.requestAnimationFrame(() => {
      document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleCheckoutClick(event) {
    event.preventDefault();
    if (checkoutLock.current) return;

    checkoutLock.current = true;
    setCheckoutBusy(true);
    const destination = createCheckoutUrl();
    setCheckoutHref(destination);

    try {
      trackEvent("CheckoutClick", {
        content_name: "Noiva Sem Surto",
        value: PRICE,
        currency: "BRL",
      });
      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout", {
          content_name: "Noiva Sem Surto",
          value: PRICE,
          currency: "BRL",
        });
      }
    } finally {
      window.setTimeout(() => window.location.assign(destination), 180);
    }
  }

  return (
    <main id="inicio">
      <header className="siteHeader">
        <div className="container headerInner">
          <Brand />
          {result ? (
            <a className="headerAction" href="#oferta">VER ACESSO</a>
          ) : (
            <a className="headerAction" href="#diagnostico" onClick={startDiagnosis}>FAZER CHECK-IN</a>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="heroOrb heroOrbOne" />
        <div className="heroOrb heroOrbTwo" />
        <div className="container heroGrid">
          <div className="heroCopy">
            <p className="eyebrow"><span /> CHECK-IN DE ORGANIZAÇÃO</p>
            <h1>Você não precisa organizar tudo agora.</h1>
            <p className="heroAccent">Descubra o que merece sua atenção primeiro.</p>
            <p className="heroText">
              Marque 3 respostas rápidas e receba um checklist personalizado com sua prioridade, seus próximos passos e o que pode esperar.
            </p>
            <button className="primaryButton heroButton" type="button" onClick={handleHeroAction}>
              <span>{result ? "VER MINHA ROTA" : "FAZER MEU CHECK-IN"}</span>
              <ArrowIcon />
            </button>
            <p className="microcopy">Sem cadastro · 3 respostas · resultado na hora</p>
          </div>

          <aside className="heroCard" aria-label="Como funciona o diagnóstico">
            <div className="heroCardTop">
              <span className="routeStamp">ROTA<br />SEM<br />SURTO</span>
              <p>Clareza antes da pressa.</p>
            </div>
            <div className="routeLine">
              <span className="routeDot active" />
              <span className="routeDot" />
              <span className="routeDot" />
              <span className="routeArrow">→</span>
            </div>
            <p className="heroCardQuote">“Quando tudo parece urgente, a primeira decisão é escolher a ordem.”</p>
          </aside>
        </div>
        <div className="container trustRow">
          <span>✓ 3 respostas</span>
          <span>✓ Sem formulário longo</span>
          <span>✓ Checklist personalizado</span>
        </div>
      </section>

      {!result && (
        <section className="previewSection">
          <div className="container previewGrid">
            <div className="previewCopy">
              <p className="eyebrow"><span /> DEPOIS DO DIAGNÓSTICO EXISTE UMA ROTA</p>
              <h2>O diagnóstico mostra o começo. O Noiva Sem Surto te conduz no restante.</h2>
              <p>
                Você não recebe uma lista genérica para dar conta. Recebe uma assessora digital que ajuda a organizar a ordem das decisões e a voltar para o próximo passo sempre que o planejamento embolar.
              </p>
              <ul className="previewList">
                <li>✓ O que faz sentido resolver agora</li>
                <li>✓ Por que essa decisão vem antes das outras</li>
                <li>✓ O que pode esperar sem virar culpa ou atraso</li>
              </ul>
            </div>
            <div className="previewPhone">
              <div className="screenFrame">
                <img
                  src="/nss-app-welcome.webp"
                  alt="Tela real do Noiva Sem Surto iniciando a rota de planejamento"
                />
              </div>
              <p>Tela real do Noiva Sem Surto</p>
            </div>
          </div>
        </section>
      )}

      {!result && (
        <section id="diagnostico" className="diagnosisSection">
          <div className="container narrow">
            {!started ? (
              <div className="diagnosisIntro">
                <p className="eyebrow centered"><span /> SEU CHECK-IN DE ORGANIZAÇÃO <span /></p>
                <h2>Descubra seu próximo passo antes de tentar organizar o casamento inteiro.</h2>
                <p>Sem cadastro e sem compromisso. São só 3 respostas para montar sua rota inicial.</p>
                <button className="secondaryButton" type="button" onClick={startDiagnosis}>
                  FAZER MEU CHECK-IN <ArrowIcon />
                </button>
              </div>
            ) : isBuilding ? (
              <div className="buildingCard" role="status" aria-live="polite">
                <span className="loadingRing" />
                <p className="eyebrow centered">MONTANDO SEU CHECK-IN…</p>
                <h2>Separando o que merece sua atenção primeiro.</h2>
                <p>Usando apenas as 3 respostas que você acabou de marcar.</p>
              </div>
            ) : (
              <div className="quizCard">
                <div className="checkinHeader">
                  <div>
                    <p className="checkinKicker">SEU CHECK-IN DE ORGANIZAÇÃO</p>
                    <p className="checkinMeta">3 respostas · sem cadastro · resultado na hora</p>
                  </div>
                  <span className="checkinPercent">{completion}% preenchido</span>
                </div>

                <div className="checkinSteps" aria-label="Etapas do check-in">
                  {CHECKPOINTS.map((item, index) => {
                    const active = index === step;
                    const done = index < step || (active && Boolean(selected));
                    return (
                      <div key={item.label} className={cx("checkinStep", active && "active", done && "done")}>
                        <span className="checkinStepIcon" aria-hidden="true">{done ? "✓" : item.emoji}</span>
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <Progress current={step} />
                <p className="eyebrow">{QUESTIONS[step].eyebrow}</p>
                <h2>{QUESTIONS[step].title}</h2>
                <p className="quizHelper">{QUESTIONS[step].helper}</p>
                <div className="optionList checklistOptions" role="radiogroup" aria-label={QUESTIONS[step].title}>
                  {QUESTIONS[step].options.map((option) => (
                    <button
                      key={option.value}
                      className={cx("optionButton", "optionChecklist", selected === option.value && "selected")}
                      type="button"
                      role="radio"
                      aria-checked={selected === option.value}
                      onClick={() => selectOption(option)}
                    >
                      <span className="optionEmoji" aria-hidden="true">{option.emoji}</span>
                      <span className="optionCopy">
                        <strong>{option.label}</strong>
                        <small>{option.description}</small>
                      </span>
                      <span className="checkMark" aria-hidden="true">{selected === option.value ? "✓" : ""}</span>
                    </button>
                  ))}
                </div>
                <div className="quizFooter">
                  {step > 0 ? (
                    <button className="backButton" type="button" onClick={() => setStep((current) => current - 1)}>
                      ← VOLTAR
                    </button>
                  ) : <span />}
                  <button className="secondaryButton" type="button" disabled={!selected} onClick={continueDiagnosis}>
                    {step === 2 ? "VER MEU CHECKLIST" : "SALVAR E CONTINUAR"} <ArrowIcon />
                  </button>
                </div>
                <p className="checkinReassurance">Você pode voltar e trocar qualquer resposta antes do resultado.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {result && route && (
        <>
          <section id="resultado" className="resultSection">
            <div className="container">
              <div className="resultHeading">
                <p className="eyebrow centered"><span /> SEU CHECK-IN ESTÁ PRONTO <span /></p>
                <h2>Agora ficou mais claro o que precisa vir primeiro.</h2>
              </div>

              <div className="resultGrid">
                <article className="resultMainCard">
                  <p className="cardLabel">SEU MOMENTO ATUAL</p>
                  <h3>{route.stage.title}</h3>
                  <p>{route.stage.text}</p>
                  <div className="riskBox">
                    <p className="cardLabel">SEU MAIOR RISCO AGORA</p>
                    <p>{route.pain.risk}</p>
                  </div>
                </article>

                <article className="priorityCard">
                  <p className="cardLabel">SUA PRIORIDADE</p>
                  <span className="priorityNumber">01</span>
                  <h3>{route.pain.priority}</h3>
                  <p>{route.pain.reason}</p>
                </article>
              </div>

              <div className="actionGrid">
                <article className="actionCard">
                  <p className="cardLabel">SEU CHECKLIST DE AGORA</p>
                  <ol>
                    {route.pain.first.map((item, index) => (
                      <li key={item}><span>{index + 1}</span><p>{item}</p></li>
                    ))}
                  </ol>
                </article>
                <article className="waitCard">
                  <p className="cardLabel">PODE FICAR PARA DEPOIS</p>
                  <ul>
                    {route.pain.wait.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <p className="calmNote">
                    Você não está atrasada para tudo. Só precisa parar de tratar todas as decisões como se tivessem a mesma urgência.
                  </p>
                </article>
              </div>

              <button className="textButton" type="button" onClick={restartDiagnosis}>↻ Refazer meu check-in</button>
            </div>
          </section>

          <section className="bridgeSection">
            <div className="container bridgeGrid">
              <div>
                <p className="eyebrow light"><span /> AGORA VOCÊ SABE O QUE VEM PRIMEIRO</p>
                <h2>Mas o casamento não trava em uma decisão só.</h2>
              </div>
              <div>
                <p>
                  Amanhã aparecem convidados, orçamento, fornecedores, pagamentos e outras escolhas. É exatamente aí que o Noiva Sem Surto entra: para colocar as próximas decisões em ordem sem te devolver para o zero.
                </p>
                <a className="lightLink" href="#como-funciona">VER O APP POR DENTRO <ArrowIcon /></a>
              </div>
            </div>
          </section>

          <section id="como-funciona" className="proofSection">
            <div className="container">
              <div className="sectionHeading">
                <p className="eyebrow centered"><span /> ISSO É O PRODUTO DE VERDADE <span /></p>
                <h2>Uma assessora digital para te conduzir decisão por decisão.</h2>
                <p>
                  O diagnóstico te mostra uma prioridade. Dentro do Noiva Sem Surto, essa lógica continua aplicada ao planejamento.
                </p>
              </div>

              <div className="proofGrid">
                <article className="proofCard">
                  <div className="proofText">
                    <p className="cardLabel">CLAREZA DESDE O COMEÇO</p>
                    <h3>Você entra e já entende a lógica da sua rota.</h3>
                    <p>Menos pressão para “saber tudo”. Mais direção para começar pelo que faz sentido.</p>
                  </div>
                  <div className="screenFrame">
                    <img
                      src="/nss-app-welcome.webp"
                      alt="Tela real do Noiva Sem Surto dando boas-vindas e iniciando a rota"
                    />
                  </div>
                </article>

                <article className="proofCard proofCardAlt">
                  <div className="proofText">
                    <p className="cardLabel">PLANEJAMENTO PRÁTICO</p>
                    <h3>A orientação vira ação dentro do app.</h3>
                    <p>Na lista de convidados, por exemplo, você organiza pessoas, famílias, grupos e quantidades de forma visual.</p>
                  </div>
                  <div className="screenFrame">
                    <img
                      src="/nss-app-guests.webp"
                      alt="Tela real do Noiva Sem Surto organizando convidados por famílias e grupos"
                    />
                  </div>
                </article>
              </div>

              <div className="valueGrid">
                {VALUE_POINTS.map((item) => (
                  <article key={item.number}>
                    <span>{item.number}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>

              <div className="bigPromise">
                <p>Não é mais uma lista mostrando tudo o que falta.</p>
                <h3>É um lugar para voltar quando você não souber o que fazer depois.</h3>
              </div>
            </div>
          </section>

          <section className="comparisonSection">
            <div className="container comparisonGrid">
              <div className="comparisonIntro">
                <p className="eyebrow"><span /> O QUE MUDA NA PRÁTICA</p>
                <h2>Menos energia tentando lembrar de tudo. Mais clareza para decidir o que importa agora.</h2>
              </div>
              <div className="comparisonCards">
                <article className="comparisonCard muted">
                  <p className="cardLabel">QUANDO TUDO FICA SOLTO</p>
                  <ul>
                    <li>várias listas abertas ao mesmo tempo</li>
                    <li>orçamentos difíceis de comparar</li>
                    <li>tarefas concentradas em uma pessoa</li>
                    <li>sensação de que tudo está atrasado</li>
                  </ul>
                </article>
                <article className="comparisonCard bright">
                  <p className="cardLabel">COM UMA ROTA</p>
                  <ul>
                    <li>uma prioridade visível por vez</li>
                    <li>base para comparar escolhas</li>
                    <li>responsabilidades mais claras</li>
                    <li>visão do que já foi resolvido</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section id="oferta" className="offerSection">
            <div className="container offerGrid">
              <div className="offerCopy">
                <p className="eyebrow light"><span /> CONTINUE SUA ROTA SEM SURTO</p>
                <h2>Tenha um lugar para voltar sempre que bater a dúvida: “e agora, o que eu faço?”</h2>
                <p>
                  O diagnóstico mostrou a primeira prioridade. O Noiva Sem Surto transforma essa clareza em uma estrutura para continuar pelas próximas decisões.
                </p>
                <ul className="offerList">
                  {INCLUDED.map((item) => <li key={item}>✓ {item}</li>)}
                </ul>
              </div>

              <aside className="priceCard">
                <p className="cardLabel">NOIVA SEM SURTO COMPLETO</p>
                <p className="priceIntro">Acesso ao mini app por</p>
                <div className="price"><span>R$</span><strong>14</strong><span>,99</span></div>
                <p className="paymentNote">pagamento único · sem mensalidade</p>

                <div className="valueAnchor">
                  <strong>Você não está comprando outra lista.</strong>
                  <p>Está comprando um lugar para voltar quando o planejamento travar e você precisar saber qual é a próxima decisão possível.</p>
                </div>

                <CheckoutButton busy={checkoutBusy} href={checkoutHref} onClick={handleCheckoutClick}>
                  QUERO MEU PLANEJAMENTO SEM SURTO
                </CheckoutButton>
                <p className="secureNote">Pagamento processado com segurança pela Kiwify.</p>
              </aside>
            </div>
          </section>

          <section className="faqSection">
            <div className="container faqGrid">
              <div>
                <p className="eyebrow"><span /> ANTES DE DECIDIR</p>
                <h2>As últimas dúvidas que podem estar passando pela sua cabeça.</h2>
                <p className="faqIntro">
                  Sem promessa milagrosa. A proposta é simples: organizar a ordem das decisões para o planejamento ficar mais claro.
                </p>
              </div>
              <div className="faqList">
                {FAQS.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}<span>+</span></summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="finalCta">
            <div className="container finalCtaInner">
              <p className="eyebrow centered light"><span /> UMA DECISÃO DE CADA VEZ <span /></p>
              <h2>Você não precisa saber tudo agora.</h2>
              <p>
                Só precisa parar de voltar para o zero toda vez que surgir uma nova dúvida. Tenha sua Rota Sem Surto completa por <strong>R$ 14,99</strong>.
              </p>
              <CheckoutButton className="lightButton" busy={checkoutBusy} href={checkoutHref} onClick={handleCheckoutClick}>
                QUERO MINHA ROTA SEM SURTO
              </CheckoutButton>
              <p className="finalMicro">Pagamento único · acesso pelo navegador · checkout Kiwify</p>
            </div>
          </section>
        </>
      )}

      <footer>
        <div className="container footerInner">
          <Brand />
          <p>© 2026 · Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
