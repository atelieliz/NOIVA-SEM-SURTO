"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { appendTrackingParams, claimEvent, mergeTrackingParams } from "@/lib/tracking.mjs";

const CHECKOUT_URL = "https://pay.kiwify.com.br/AUehsBX";
const PRICE = 14.99;
const TRACKING_STORAGE_KEY = "nss_landing_tracking";
const RESULT_STORAGE_KEY = "nss_landing_result_v4";

const QUESTIONS = [
  {
    eyebrow: "PERGUNTA 1 DE 3",
    title: "Qual celebração você quer tirar do papel?",
    options: [
      "Meu casamento.",
      "Casamento civil com comemoração.",
      "Mini wedding ou cerimônia íntima.",
      "Bodas ou renovação de votos.",
      "Ainda estamos decidindo o formato.",
    ],
  },
  {
    eyebrow: "PERGUNTA 2 DE 3",
    title: "Onde o planejamento começa a sair do controle?",
    options: [
      "Não sei por onde começar.",
      "Tenho medo de gastar mais do que podemos.",
      "A lista de convidados está virando um problema.",
      "Não sei quais fornecedores contratar primeiro.",
      "Tenho muitas ideias, mas nenhum plano.",
      "Estou organizando praticamente tudo sozinha.",
    ],
  },
  {
    eyebrow: "PERGUNTA 3 DE 3",
    title: "Em qual fase sua celebração está?",
    options: [
      "Ainda é uma ideia, sem data definida.",
      "Já temos uma data, mas quase nada organizado.",
      "Já começamos a pesquisar e pedir orçamentos.",
      "Já contratamos algumas coisas, mas falta controle.",
      "Faltam poucos meses e estamos atrasados.",
      "Estamos reorganizando tudo para bodas ou renovação.",
    ],
  },
];

const PAIN_ROUTES = {
  "Não sei por onde começar.": {
    risk: "Pesquisar detalhes antes de definir a base.",
    priority: "Criar a base real da celebração",
    reason: "Valor, convidados e formato orientam todo o resto.",
    wait: ["lembranças", "papelaria complementar", "atrações extras", "detalhes decorativos"],
  },
  "Tenho medo de gastar mais do que podemos.": {
    risk: "Pedir orçamentos sem saber o limite do casal.",
    priority: "Transformar desejo em um valor possível",
    reason: "Um limite claro facilita comparações e evita escolhas no susto.",
    wait: ["extras de decoração", "lembranças", "papelaria adicional", "upgrades sem orçamento"],
  },
  "A lista de convidados está virando um problema.": {
    risk: "Contar nomes sem enxergar famílias, grupos e impacto no orçamento.",
    priority: "Estimar convidados por família ou grupo",
    reason: "A quantidade real orienta espaço, buffet e investimento.",
    wait: ["posição nas mesas", "convites individuais", "lembranças", "confirmação final"],
  },
  "Não sei quais fornecedores contratar primeiro.": {
    risk: "Comparar propostas diferentes sem os mesmos critérios.",
    priority: "Definir critérios antes de pedir novos orçamentos",
    reason: "Formato, quantidade e valor mostram o que comparar primeiro.",
    wait: ["fornecedores extras", "personalizações", "detalhes estéticos", "itens sem impacto na estrutura"],
  },
  "Tenho muitas ideias, mas nenhum plano.": {
    risk: "Tentar encaixar todas as referências ao mesmo tempo.",
    priority: "Transformar referências em prioridades",
    reason: "O essencial vira filtro para o restante das ideias.",
    wait: ["tendências", "detalhes de inspiração", "compras por impulso", "itens sem significado"],
  },
  "Estou organizando praticamente tudo sozinha.": {
    risk: "Acumular decisões sem definir quem participa de cada etapa.",
    priority: "Dividir as primeiras responsabilidades com clareza",
    reason: "As decisões centrais são do casal; a execução pode ser dividida.",
    wait: ["tarefas sem prazo", "opiniões externas", "detalhes não prioritários", "decisões sem base"],
  },
};

const STAGE_COPY = {
  "Ainda é uma ideia, sem data definida.": {
    title: "Comece pela base",
    text: "Defina tamanho, valor e formato antes das pesquisas.",
  },
  "Já temos uma data, mas quase nada organizado.": {
    title: "A data existe. Falta uma ordem.",
    text: "Organize as decisões para proteger tempo e orçamento.",
  },
  "Já começamos a pesquisar e pedir orçamentos.": {
    title: "Você já pesquisa. Faltam critérios.",
    text: "Compare propostas usando a mesma base.",
  },
  "Já contratamos algumas coisas, mas falta controle.": {
    title: "As escolhas existem. Falta controle.",
    text: "Reúna decisões e veja o que depende do quê.",
  },
  "Faltam poucos meses e estamos atrasados.": {
    title: "O prazo apertou. Foque no essencial.",
    text: "Priorize o que sustenta a celebração.",
  },
  "Estamos reorganizando tudo para bodas ou renovação.": {
    title: "Uma nova celebração pede outra rota.",
    text: "Organize o que combina com o momento de vocês.",
  },
};

const PRODUCT_TOOLS = [
  { icon: "⌁", title: "Bússola Sem Surto", text: "Mostra o que faz sentido resolver agora." },
  { icon: "↗", title: "Minha Rota", text: "Separa o que vem agora, depois e o que já foi concluído." },
  { icon: "R$", title: "Planejamento de investimento", text: "Ajuda a organizar um valor possível para orientar escolhas." },
  { icon: "👥", title: "Lista por família e grupo", text: "Organiza pessoas, famílias, grupos e quantidades." },
  { icon: "⇄", title: "Comparador de fornecedores", text: "Coloca propostas lado a lado usando critérios comuns." },
  { icon: "✓", title: "Responsabilidades claras", text: "Ajuda a visualizar quem cuida de cada etapa." },
  { icon: "✦", title: "Área Celebração", text: "Reúne decisões importantes da celebração em um só lugar." },
  { icon: "SOS", title: "SOS Noiva", text: "Dá um ponto de partida quando algo sai do eixo." },
];

const FAQS = [
  {
    question: "O diagnóstico é gratuito?",
    answer: "Sim. As três perguntas e a rota inicial são gratuitas. A compra é opcional e libera a experiência completa do Noiva Sem Surto.",
  },
  {
    question: "Por que comprar se o diagnóstico já mostrou meu próximo passo?",
    answer: "Porque o diagnóstico mostra a primeira prioridade. Depois dela surgem novas decisões. O Noiva Sem Surto organiza a sequência e te dá um lugar para continuar sem voltar à sensação de não saber por onde começar.",
  },
  {
    question: "Eu já tenho listas e planilhas. Não é a mesma coisa?",
    answer: "Não. Uma lista mostra tudo o que existe para fazer. A proposta do Noiva Sem Surto é ajudar a enxergar a ordem: o que faz sentido resolver agora, o que vem depois e o que pode esperar.",
  },
  {
    question: "Preciso instalar alguma coisa?",
    answer: "Não. O acesso acontece pelo navegador do celular ou computador. Você também pode adicionar um atalho à tela inicial para abrir mais rápido.",
  },
  {
    question: "Serve para bodas e renovação de votos?",
    answer: "Sim. O momento escolhido no início orienta a organização da celebração sem obrigar vocês a repetir a estrutura de um casamento tradicional.",
  },
  {
    question: "É uma assinatura?",
    answer: "Não. O valor de R$ 14,99 é pago uma única vez, sem mensalidade.",
  },
  {
    question: "E se eu entrar e perceber que não é para mim?",
    answer: "A compra conta com 7 dias de garantia. As condições finais também aparecem no checkout seguro da Kiwify.",
  },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function saveTrackingParams() {
  let savedSearch = "";
  try {
    savedSearch = window.sessionStorage.getItem(TRACKING_STORAGE_KEY) || "";
  } catch {
    savedSearch = "";
  }

  const merged = mergeTrackingParams(window.location.search, savedSearch);
  try {
    window.sessionStorage.setItem(TRACKING_STORAGE_KEY, merged);
  } catch {
    // O checkout continua funcionando quando o navegador bloqueia armazenamento.
  }
  return merged;
}

function createCheckoutUrl() {
  return appendTrackingParams(CHECKOUT_URL, saveTrackingParams());
}

function queueMetaEvent(name, payload) {
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", name, payload);
    return;
  }
  window.__nssPendingPixelEvents = window.__nssPendingPixelEvents || [];
  window.__nssPendingPixelEvents.push([name, payload]);
}

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Noiva Sem Surto — início">
      <span className="brandMark" aria-hidden="true">NSS</span>
      <span className="brandText">Noiva Sem Surto</span>
    </a>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

function CheckoutButton({ className, children, busy, href, onClick, placement }) {
  return (
    <a
      className={cx("primaryButton", className, busy && "isBusy")}
      href={href}
      onClick={(event) => onClick(event, placement)}
      aria-disabled={busy}
      data-checkout-placement={placement}
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

function AppScreenshot({ src, alt, className, sizes = "(max-width: 900px) 82vw, 420px" }) {
  return (
    <div className={cx("phoneFrame", className)}>
      <span className="phoneSpeaker" aria-hidden="true" />
      <div className="screenCrop">
        <Image src={src} alt={alt} width={878} height={1796} sizes={sizes} />
      </div>
    </div>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([null, null, null]);
  const [result, setResult] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [checkoutHref, setCheckoutHref] = useState(CHECKOUT_URL);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const checkoutLock = useRef(false);
  const completionLock = useRef(false);
  const trackedEvents = useRef(new Set());

  useEffect(() => {
    setCheckoutHref(createCheckoutUrl());
    const resetCheckout = () => {
      checkoutLock.current = false;
      setCheckoutBusy(false);
      setCheckoutHref(createCheckoutUrl());
    };
    window.addEventListener("pageshow", resetCheckout);

    try {
      const stored = window.localStorage.getItem(RESULT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.answers) && parsed.answers.length === 3) {
          setAnswers(parsed.answers);
          setResult(parsed);
        }
      }
    } catch {
      try { window.localStorage.removeItem(RESULT_STORAGE_KEY); } catch {}
    }

    return () => window.removeEventListener("pageshow", resetCheckout);
  }, []);

  useEffect(() => {
    if (!result) return;
    const pain = PAIN_ROUTES[result.answers[1]] || PAIN_ROUTES[QUESTIONS[1].options[0]];
    const eventKey = `result-view:${result.createdAt}`;
    if (claimEvent(trackedEvents.current, eventKey)) {
      queueMetaEvent("ResultView", {
        content_name: "Diagnóstico Noiva Sem Surto",
        priority: pain.priority,
      });
    }
  }, [result]);

  const selected = answers[step];
  const route = useMemo(() => {
    if (!result) return null;
    return {
      pain: PAIN_ROUTES[result.answers[1]] || PAIN_ROUTES[QUESTIONS[1].options[0]],
      stage: STAGE_COPY[result.answers[2]] || STAGE_COPY[QUESTIONS[2].options[0]],
    };
  }, [result]);

  function startDiagnosis() {
    setStarted(true);
    if (claimEvent(trackedEvents.current, "diagnostic-start")) {
      queueMetaEvent("StartDiagnostic", {
        content_name: "Diagnóstico Noiva Sem Surto",
        questions_total: QUESTIONS.length,
      });
    }
    window.requestAnimationFrame(() => {
      document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleHeroAction() {
    if (!result) return startDiagnosis();
    document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectOption(option) {
    setAnswers((current) => current.map((value, index) => (index === step ? option : value)));
  }

  function continueDiagnosis() {
    if (!selected) return;
    if (step < QUESTIONS.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    if (completionLock.current) return;

    completionLock.current = true;
    setIsBuilding(true);
    window.setTimeout(() => {
      const nextResult = { answers, createdAt: Date.now() };
      try { window.localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(nextResult)); } catch {}

      queueMetaEvent("CompleteDiagnostic", {
        content_name: "Diagnóstico Noiva Sem Surto",
        questions_answered: QUESTIONS.length,
        pain_point: answers[1],
      });

      setResult(nextResult);
      setIsBuilding(false);
      completionLock.current = false;
      window.requestAnimationFrame(() => {
        document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 850);
  }

  function restartDiagnosis() {
    try { window.localStorage.removeItem(RESULT_STORAGE_KEY); } catch {}
    trackedEvents.current.delete("diagnostic-start");
    completionLock.current = false;
    setAnswers([null, null, null]);
    setStep(0);
    setResult(null);
    setStarted(true);
    window.requestAnimationFrame(() => {
      document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleCheckoutClick(event, placement) {
    event.preventDefault();
    if (checkoutLock.current) return;

    checkoutLock.current = true;
    setCheckoutBusy(true);
    const destination = createCheckoutUrl();
    setCheckoutHref(destination);

    queueMetaEvent("CheckoutClick", {
      content_name: "Noiva Sem Surto",
      content_type: "product",
      placement,
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

    window.setTimeout(() => window.location.assign(destination), 220);
  }

  return (
    <main id="inicio">
      <header className="siteHeader">
        <div className="container headerInner">
          <Brand />
          {result ? (
            <a className="headerAction" href="#oferta">VER ACESSO</a>
          ) : (
            <a className="headerAction" href="#diagnostico" onClick={startDiagnosis}>FAZER DIAGNÓSTICO</a>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />
        <div className="container heroGrid">
          <div className="heroCopy">
            <p className="eyebrow"><span /> ROTA PERSONALIZADA</p>
            <h1>Você não precisa organizar tudo agora.</h1>
            <p className="heroAccent">Precisa descobrir o que vem primeiro.</p>
            <p className="heroText">
              Responda 3 perguntas rápidas e descubra qual decisão pode destravar seu planejamento agora — sem lista infinita e sem tentar resolver tudo de uma vez.
            </p>
            <button className="primaryButton heroButton" type="button" onClick={handleHeroAction}>
              <span>{result ? "VOLTAR AO MEU RESULTADO" : "DESCOBRIR MEU PRÓXIMO PASSO"}</span>
              <ArrowIcon />
            </button>
            <p className="microcopy">Gratuito · sem cadastro · resultado na hora</p>
          </div>

          <aside className="heroCard" aria-label="Etapas do diagnóstico">
            <div className="heroCardTop">
              <span className="routeStamp">ROTA<br />SEM<br />SURTO</span>
              <p>Clareza antes da pressa.</p>
            </div>
            <ol className="heroSteps">
              <li><span>01</span><p>Seu momento</p></li>
              <li><span>02</span><p>O que trava</p></li>
              <li><span>03</span><p>Próxima decisão</p></li>
            </ol>
            <p className="heroCardQuote">Uma decisão de cada vez.</p>
          </aside>
        </div>
        <div className="container trustRow" aria-label="Vantagens do diagnóstico">
          <span>✓ 3 perguntas</span>
          <span>✓ Leitura personalizada</span>
          <span>✓ Sem lista infinita</span>
        </div>
      </section>

      {!result && (
        <section className="preProofSection">
          <div className="container preProofGrid">
            <div className="preProofCopy">
              <p className="eyebrow"><span /> DEPOIS DO DIAGNÓSTICO EXISTE UMA ROTA</p>
              <h2>O diagnóstico mostra o começo. O Noiva Sem Surto te conduz no restante.</h2>
              <p>
                Você não recebe uma lista genérica para dar conta. Recebe uma assessora digital que ajuda a organizar a ordem das decisões e a voltar para o próximo passo sempre que o planejamento embolar.
              </p>
              <ul className="preProofList">
                <li>✓ O que faz sentido resolver agora</li>
                <li>✓ Por que essa decisão vem antes das outras</li>
                <li>✓ O que pode esperar sem virar culpa ou atraso</li>
              </ul>
            </div>
            <div className="preProofPhone">
              <AppScreenshot
                src="/app-screens/boas-vindas-real.webp"
                alt="Tela real do Noiva Sem Surto dando boas-vindas e iniciando a rota da noiva"
              />
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
                <p className="eyebrow centered"><span /> PRIMEIRO: ENTENDER SEU MOMENTO <span /></p>
                <h2>Descubra seu próximo passo antes de tentar organizar o casamento inteiro.</h2>
                <p>Escolha o que mais parece com o seu momento. São só 3 perguntas.</p>
                <button className="secondaryButton" type="button" onClick={startDiagnosis}>
                  COMEÇAR AS 3 PERGUNTAS <ArrowIcon />
                </button>
              </div>
            ) : isBuilding ? (
              <div className="buildingCard" role="status" aria-live="polite">
                <span className="loadingRing" />
                <p className="eyebrow centered">ORGANIZANDO SUA ROTA SEM SURTO…</p>
                <h2>Encontrando o ponto que merece sua atenção primeiro.</h2>
                <p>Análise baseada nas três respostas que você forneceu.</p>
              </div>
            ) : (
              <div className="quizCard">
                <Progress current={step} />
                <p className="eyebrow">{QUESTIONS[step].eyebrow}</p>
                <h2>{QUESTIONS[step].title}</h2>
                <div className="optionList" role="radiogroup" aria-label={QUESTIONS[step].title}>
                  {QUESTIONS[step].options.map((option) => (
                    <button
                      key={option}
                      className={cx("optionButton", selected === option && "selected")}
                      type="button"
                      role="radio"
                      aria-checked={selected === option}
                      onClick={() => selectOption(option)}
                    >
                      <span className="radioMark" />
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
                <div className="quizFooter">
                  {step > 0 ? (
                    <button className="backButton" type="button" onClick={() => setStep((current) => current - 1)}>← VOLTAR</button>
                  ) : <span />}
                  <button className="secondaryButton" type="button" disabled={!selected} onClick={continueDiagnosis}>
                    {step === 2 ? "CRIAR MINHA ROTA" : "CONTINUAR"} <ArrowIcon />
                  </button>
                </div>
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
                <p className="eyebrow centered"><span /> SEU DIAGNÓSTICO <span /></p>
                <h2>Agora ficou mais claro o que precisa vir primeiro.</h2>
                <p>Você não precisa resolver tudo. Precisa proteger a ordem das decisões.</p>
              </div>

              <div className="resultSignalGrid">
                <article className="resultSignalCard momentCard">
                  <span className="resultSignalIcon" aria-hidden="true">✦</span>
                  <p className="cardLabel">SEU MOMENTO</p>
                  <h3>{route.stage.title}</h3>
                  <p>{route.stage.text}</p>
                </article>
                <article className="resultSignalCard attentionCard">
                  <span className="resultSignalIcon" aria-hidden="true">!</span>
                  <p className="cardLabel">O QUE PODE ATRAPALHAR</p>
                  <p>{route.pain.risk}</p>
                </article>
                <article className="resultSignalCard priorityCard">
                  <span className="resultSignalIcon" aria-hidden="true">→</span>
                  <p className="cardLabel">SUA PRIORIDADE AGORA</p>
                  <h3>{route.pain.priority}</h3>
                  <p>{route.pain.reason}</p>
                </article>
              </div>

              <article className="waitCard compactWaitCard">
                <div>
                  <span className="resultSignalIcon small" aria-hidden="true">⌛</span>
                  <p className="cardLabel">ISSO PODE ESPERAR</p>
                </div>
                <ul>{route.pain.wait.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>

              <button className="textButton" type="button" onClick={restartDiagnosis}>↻ Refazer meu diagnóstico</button>
              <div className="routeFlowCue" aria-hidden="true"><span>↓</span><span>↓</span><span>↓</span></div>
            </div>
          </section>

          <section className="problemCostSection">
            <div className="container problemCostGrid">
              <div>
                <p className="eyebrow"><span /> O CUSTO DA ORDEM ERRADA</p>
                <h2>O problema não é falta de esforço. É tentar decidir tudo fora de ordem.</h2>
              </div>
              <div className="problemStack">
                <article><span>01</span><p>Orçamentos sem um limite claro.</p></article>
                <article><span>02</span><p>Detalhes antes das decisões que sustentam o evento.</p></article>
                <article><span>03</span><p>Muitas abas abertas. Poucas decisões fechadas.</p></article>
              </div>
            </div>
          </section>

          <section className="bridgeSection">
            <div className="container bridgeInner">
              <p className="eyebrow centered"><span /> AGORA VOCÊ SABE O QUE VEM PRIMEIRO <span /></p>
              <h2>Mas o casamento não trava em uma decisão só.</h2>
              <p>
                Amanhã aparecem convidados, orçamento, fornecedores, pagamentos e outras escolhas. É exatamente aí que o Noiva Sem Surto entra: para colocar as próximas decisões em ordem sem te devolver para o zero.
              </p>
              <div className="bridgePromise">
                <span aria-hidden="true">⌁</span>
                <strong>Você não precisa voltar para o zero.</strong>
                <small>Abra, veja a próxima decisão e continue.</small>
              </div>
            </div>
          </section>

          <section className="compassSection">
            <div className="container compassGrid">
              <div className="compassCopy">
                <p className="eyebrow"><span /> DEMONSTRAÇÃO REAL</p>
                <h2>Abra. Veja a prioridade. Decida.</h2>
                <p className="displayAccent">Uma decisão por vez.</p>
                <div className="demoDecisionCard">
                  <p className="cardLabel">NA BÚSSOLA, VOCÊ ENCONTRA</p>
                  <ul>
                    <li><span>01</span> Prioridade</li>
                    <li><span>02</span> Motivo</li>
                    <li><span>03</span> Tempo</li>
                    <li><span>04</span> Próximo passo</li>
                  </ul>
                </div>
                <p className="proofNote">Tela real do mini-app.</p>
              </div>
              <AppScreenshot
                src="/app-screens/bussola.webp"
                alt="Tela real da Bússola Sem Surto mostrando uma prioridade do planejamento"
                className="mainPhone"
              />
            </div>
          </section>

          <section className="unlocksSection">
            <div className="container">
              <div className="sectionHeading">
                <p className="eyebrow centered"><span /> O QUE MUDA QUANDO VOCÊ ENTRA <span /></p>
                <h2>Você deixa de carregar o casamento inteiro na cabeça.</h2>
                <p>O app reúne decisões e mostra o que merece atenção agora.</p>
              </div>

              <div className="toolGrid">
                {PRODUCT_TOOLS.map((tool) => (
                  <article className="toolCard" key={tool.title}>
                    <span className="toolIcon" aria-hidden="true">{tool.icon}</span>
                    <h3>{tool.title}</h3>
                    <p>{tool.text}</p>
                  </article>
                ))}
              </div>

              <div className="proofGallery" aria-label="Telas reais do mini app">
                <article>
                  <AppScreenshot src="/app-screens/minha-rota.webp" alt="Tela Minha Rota com etapas concluídas, atual e próximas decisões" sizes="(max-width: 900px) 72vw, 300px" />
                  <div><span>01</span><h3>O caminho em ordem</h3><p>Concluído, agora e depois ficam visíveis.</p></div>
                </article>
                <article>
                  <AppScreenshot src="/app-screens/planejamento.webp" alt="Tela de planejamento com investimento, lista, fornecedores e responsabilidades" sizes="(max-width: 900px) 72vw, 300px" />
                  <div><span>02</span><h3>Planejamento reunido</h3><p>Abra somente o bloco que pede decisão.</p></div>
                </article>
                <article>
                  <AppScreenshot src="/app-screens/sos.webp" alt="Tela SOS com situações comuns do planejamento" sizes="(max-width: 900px) 72vw, 300px" />
                  <div><span>03</span><h3>Direção quando algo sai do eixo</h3><p>Situações comuns ganham um ponto de partida.</p></div>
                </article>
              </div>
            </div>
          </section>

          <section className="dreamListSection">
            <div className="container dreamListGrid">
              <div className="dreamListCopy">
                <p className="eyebrow"><span /> TELA REAL: LISTA DE CONVIDADOS</p>
                <h2>Do “quem a gente convida?” para uma lista que dá para enxergar.</h2>
                <p>
                  Adicione uma pessoa, casal, família ou grupo por vez. O app soma as quantidades e separa os convidados de um jeito mais visual.
                </p>
                <blockquote>Menos nomes soltos. Mais visão do tamanho real da celebração.</blockquote>
              </div>
              <AppScreenshot
                src="/app-screens/convidados-real.webp"
                alt="Tela real do Noiva Sem Surto organizando convidados por famílias, grupos e quantidade de pessoas"
                className="dreamPhone"
              />
            </div>
          </section>

          <section className="trustSection">
            <div className="container">
              <div className="sectionHeading trustHeading">
                <p className="eyebrow centered"><span /> PRODUTO REAL, CONDIÇÕES CLARAS <span /></p>
                <h2>Não é um PDF bonito que você baixa e esquece.</h2>
                <p>É um mini-app para abrir pelo celular e consultar conforme o planejamento avança.</p>
              </div>

              <div className="trustCards">
                <article><span>▣</span><h3>Mini-app</h3><p>Abra pelo navegador e volte conforme o planejamento avança.</p></article>
                <article><span>◎</span><h3>Telas reais</h3><p>As demonstrações desta página mostram a experiência do produto.</p></article>
                <article><span>↗</span><h3>Acesso simples</h3><p>Use pelo celular ou computador, sem instalar programa.</p></article>
                <article><span>✓</span><h3>7 dias de garantia</h3><p>Você pode conhecer a experiência e conferir se ela faz sentido para você.</p></article>
              </div>

              <div className="faqGrid">
                <div>
                  <p className="eyebrow"><span /> ANTES DE DECIDIR</p>
                  <h2>As últimas dúvidas antes de continuar.</h2>
                  <p className="objectionNote">Sem promessa milagrosa: a proposta é organizar a ordem das decisões para o planejamento ficar mais claro.</p>
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
            </div>
          </section>

          <section id="oferta" className="offerSection">
            <div className="container offerGrid">
              <div className="offerCopy">
                <p className="eyebrow"><span /> CONTINUE SUA ROTA SEM SURTO</p>
                <h2>Tenha um lugar para voltar sempre que bater a dúvida: “e agora, o que eu faço?”</h2>
                <p>
                  O diagnóstico mostrou a primeira prioridade. O Noiva Sem Surto transforma essa clareza em uma estrutura para continuar pelas próximas decisões.
                </p>
                <ul className="offerList">
                  <li>✓ Bússola + Minha Rota</li>
                  <li>✓ Orçamento, convidados e fornecedores</li>
                  <li>✓ Responsabilidades, Celebração e SOS</li>
                  <li>✓ Acesso pelo celular ou computador</li>
                </ul>
              </div>

              <aside className="priceCard">
                <p className="cardLabel">NOIVA SEM SURTO COMPLETO</p>
                <p className="priceIntro">Pagamento único</p>
                <div className="price"><span>R$</span><strong>14</strong><span>,99</span></div>
                <p className="paymentNote">sem mensalidade</p>

                <div className="valueAnchor">
                  <strong>Você não está comprando outra lista.</strong>
                  <p>Está comprando um lugar para voltar quando o planejamento travar e você precisar saber qual é a próxima decisão possível.</p>
                </div>

                <CheckoutButton
                  busy={checkoutBusy}
                  href={checkoutHref}
                  onClick={handleCheckoutClick}
                  placement="offer_main"
                >
                  QUERO MEU PLANEJAMENTO SEM SURTO
                </CheckoutButton>
                <p className="secureNote">Pagamento processado com segurança pela Kiwify.</p>
              </aside>
            </div>
          </section>

          <section className="finalCheckoutSection finalCheckoutUpgrade">
            <div className="container finalCheckoutInner">
              <p className="eyebrow centered"><span /> UMA DECISÃO DE CADA VEZ <span /></p>
              <h2>Você não precisa saber tudo agora.</h2>
              <p>Só precisa parar de voltar para o zero toda vez que surgir uma nova dúvida.</p>
              <div className="finalPrice">R$ 14,99 <span>· pagamento único</span></div>
              <CheckoutButton
                className="finalCheckoutButton"
                busy={checkoutBusy}
                href={checkoutHref}
                onClick={handleCheckoutClick}
                placement="final_cta"
              >
                QUERO MINHA ROTA SEM SURTO
              </CheckoutButton>
              <small>Acesso após a confirmação · checkout seguro pela Kiwify</small>
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
