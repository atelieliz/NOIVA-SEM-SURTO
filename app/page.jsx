"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { appendTrackingParams, mergeTrackingParams } from "@/lib/tracking.mjs";

const CHECKOUT_URL = "https://pay.kiwify.com.br/AUehsBX";
const TRACKING_STORAGE_KEY = "nss_landing_tracking";
const RESULT_STORAGE_KEY = "nss_landing_result_v2";

// Módulos mantidos no projeto, mas fora da experiência até a entrega estar pronta.
const FUTURE_MODULES = Object.freeze({
  bussolaSemSurto: { name: "Bússola Sem Surto", visible: false },
  listaDosSonhos: { name: "Lista dos Sonhos", visible: false },
});

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
    risk: "pesquisar detalhes antes de definir a estrutura que sustenta todas as outras escolhas.",
    priority: "Criar a base real da celebração",
    reason:
      "Valor possível, convidados e formato são as três decisões que dão direção a orçamento, local e fornecedores.",
    first: [
      "Definir, em casal, o valor possível para a celebração.",
      "Estimar os convidados por família ou grupo.",
      "Escolher o formato e o tamanho aproximado do momento.",
    ],
    wait: ["lembranças", "papelaria complementar", "atrações extras", "detalhes decorativos"],
  },
  "Tenho medo de gastar mais do que podemos.": {
    risk: "pedir orçamentos sem um limite claro e acabar escolhendo pelo susto, não pela prioridade.",
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
    text: "Nem tudo tem a mesma urgência. O foco agora é proteger o que sustenta a celebração e retirar peso do que pode ser simplificado.",
  },
  "Estamos reorganizando tudo para bodas ou renovação.": {
    title: "Uma nova celebração merece uma rota feita para este momento",
    text: "Bodas e renovação não precisam repetir um casamento. A organização deve partir do significado atual, das pessoas presentes e do formato que faz sentido agora.",
  },
};

const PRODUCT_TOOLS = [
  {
    icon: "R$",
    title: "Valor possível",
    text: "Defina em casal um limite real para orientar as próximas pesquisas.",
  },
  {
    icon: "👥",
    title: "Convidados por grupo",
    text: "Estime pessoas por família ou grupo e enxergue o total previsto.",
  },
  {
    icon: "↗",
    title: "Rota personalizada",
    text: "Veja qual decisão vem primeiro e o que pode esperar no seu momento.",
  },
  {
    icon: "⇄",
    title: "Comparação de fornecedores",
    text: "Organize critérios e propostas para comparar com mais clareza.",
  },
  {
    icon: "✓",
    title: "Responsabilidades claras",
    text: "Defina quem participa e quem conduz cada próxima tarefa.",
  },
  {
    icon: "✦",
    title: "Celebração estruturada",
    text: "Acompanhe o que já foi resolvido e receba orientações no contexto certo.",
  },
];

const FAQS = [
  {
    question: "É só uma lista de tarefas?",
    answer:
      "Não. O mini app organiza decisões conectadas. Ele parte do seu momento e mostra prioridades, responsáveis e próximos passos sem entregar uma lista genérica de centenas de itens.",
  },
  {
    question: "Serve para bodas e renovação de votos?",
    answer:
      "Sim. A rota considera o tipo de celebração informado e adapta a organização ao momento que vocês estão vivendo.",
  },
  {
    question: "Preciso já ter data ou orçamento definidos?",
    answer:
      "Não. O mini app ajuda justamente a construir essa base e a entender qual dessas decisões precisa vir primeiro.",
  },
  {
    question: "Preciso instalar alguma coisa?",
    answer:
      "Não. O acesso é feito pelo navegador do celular ou computador. O planejamento fica salvo no navegador utilizado.",
  },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
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
  const [started, setStarted] = useState(false);
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

  const selected = answers[step];

  const route = useMemo(() => {
    if (!result) return null;
    const pain = PAIN_ROUTES[result.answers[1]] || PAIN_ROUTES[QUESTIONS[1].options[0]];
    const stage = STAGE_COPY[result.answers[2]] || STAGE_COPY[QUESTIONS[2].options[0]];
    return { pain, stage };
  }, [result]);

  function startDiagnosis() {
    setStarted(true);
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
    setAnswers((current) => current.map((value, index) => (index === step ? option : value)));
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
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "CheckoutClick", {
          content_name: "Noiva Sem Surto",
          content_type: "product",
          value: 29.9,
          currency: "BRL",
        });
      }
    } finally {
      window.setTimeout(() => window.location.assign(destination), 180);
    }
  }

  // A referência impede que os módulos futuros sejam removidos por engano.
  void FUTURE_MODULES;

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
        <div className="heroOrb heroOrbOne" />
        <div className="heroOrb heroOrbTwo" />
        <div className="container heroGrid">
          <div className="heroCopy">
            <p className="eyebrow"><span /> ROTA PERSONALIZADA</p>
            <h1>Você não precisa organizar tudo agora.</h1>
            <p className="heroAccent">Precisa descobrir o que vem primeiro.</p>
            <p className="heroText">
              Responda três perguntas rápidas e receba uma leitura personalizada para organizar casamento, bodas ou celebração sem se perder entre orçamento, convidados, fornecedores e detalhes.
            </p>
            <button className="primaryButton heroButton" type="button" onClick={handleHeroAction}>
              <span>{result ? "VER MINHA ROTA" : "DESCOBRIR MEU PRÓXIMO PASSO"}</span>
              <ArrowIcon />
            </button>
            <p className="microcopy">Leva menos de 3 minutos.</p>
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
        <div className="container trustRow" aria-label="Vantagens do diagnóstico">
          <span>✓ Diagnóstico gratuito</span>
          <span>✓ 3 perguntas</span>
          <span>✓ Resultado na hora</span>
        </div>
      </section>

      {!result && (
        <section id="diagnostico" className="diagnosisSection">
          <div className="container narrow">
            {!started ? (
              <div className="diagnosisIntro">
                <p className="eyebrow centered"><span /> PRIMEIRO: ENTENDER SEU MOMENTO <span /></p>
                <h2>Antes de falar sobre o produto, vamos descobrir o que você precisa agora.</h2>
                <p>Sem cadastro e sem compromisso. Suas respostas criam uma rota inicial para o seu momento.</p>
                <button className="secondaryButton" type="button" onClick={startDiagnosis}>COMEÇAR AS 3 PERGUNTAS <ArrowIcon /></button>
              </div>
            ) : isBuilding ? (
              <div className="buildingCard" role="status" aria-live="polite">
                <span className="loadingRing" />
                <p className="eyebrow centered">ORGANIZANDO SUA ROTA SEM SURTO…</p>
                <h2>Identificando sua fase.</h2>
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
                <p className="eyebrow centered"><span /> SUA ROTA ESTÁ PRONTA <span /></p>
                <h2>O que precisa vir primeiro ficou mais claro.</h2>
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
                  <p className="cardLabel">O QUE FAZER PRIMEIRO</p>
                  <ol>
                    {route.pain.first.map((item, index) => (
                      <li key={item}><span>{index + 1}</span><p>{item}</p></li>
                    ))}
                  </ol>
                </article>
                <article className="waitCard">
                  <p className="cardLabel">O QUE PODE ESPERAR</p>
                  <ul>
                    {route.pain.wait.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <p className="calmNote">Você não está atrasada para tudo. Só precisa parar de tratar todas as decisões como se tivessem a mesma urgência.</p>
                </article>
              </div>

              <button className="textButton" type="button" onClick={restartDiagnosis}>↻ Refazer meu diagnóstico</button>
            </div>
          </section>

          <section className="bridgeSection">
            <div className="container bridgeGrid">
              <div>
                <p className="eyebrow light"><span /> O DIAGNÓSTICO MOSTROU O COMEÇO</p>
                <h2>Agora você precisa de uma rota que acompanhe as decisões.</h2>
              </div>
              <div>
                <p>Uma orientação isolada ajuda por alguns minutos. O Noiva Sem Surto transforma essa clareza em uma jornada guiada: uma prioridade por vez, com as informações conectadas.</p>
                <a className="lightLink" href="#como-funciona">VER O QUE VOCÊ RECEBE <ArrowIcon /></a>
              </div>
            </div>
          </section>

          <section id="como-funciona" className="productSection">
            <div className="container">
              <div className="sectionHeading">
                <p className="eyebrow centered"><span /> NÃO É UMA LISTA GENÉRICA <span /></p>
                <h2>É um mini app para decidir com mais clareza e acompanhar o que já foi resolvido.</h2>
                <p>O planejamento se adapta ao tipo de celebração e ao momento informado por você.</p>
              </div>

              <div className="stepsGrid">
                <article><span>01</span><h3>Comece pelo essencial</h3><p>Valor possível, convidados e formato criam a base antes das pesquisas.</p></article>
                <article><span>02</span><h3>Receba sua rota</h3><p>As decisões entram em uma sequência clara, com o que vem agora e o que pode esperar.</p></article>
                <article><span>03</span><h3>Organize as escolhas</h3><p>Responsáveis, fornecedores e detalhes ficam ligados às prioridades da celebração.</p></article>
                <article><span>04</span><h3>Acompanhe o avanço</h3><p>Você enxerga o que já foi definido e qual é o próximo movimento possível.</p></article>
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
            </div>
          </section>

          <section className="comparisonSection">
            <div className="container comparisonGrid">
              <div className="comparisonIntro">
                <p className="eyebrow"><span /> MENOS RUÍDO, MAIS DIREÇÃO</p>
                <h2>O objetivo não é fazer você planejar mais. É impedir que você gaste energia na decisão errada.</h2>
              </div>
              <div className="comparisonCards">
                <article className="comparisonCard muted">
                  <p className="cardLabel">SEM UMA ROTA</p>
                  <ul>
                    <li>pesquisas abertas ao mesmo tempo</li>
                    <li>orçamentos difíceis de comparar</li>
                    <li>tarefas concentradas em uma pessoa</li>
                    <li>sensação de que tudo está atrasado</li>
                  </ul>
                </article>
                <article className="comparisonCard bright">
                  <p className="cardLabel">COM O NOIVA SEM SURTO</p>
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
                <p className="eyebrow light"><span /> ACESSO AO MINI APP</p>
                <h2>Continue exatamente de onde sua Rota Sem Surto terminou.</h2>
                <p>Organize as próximas decisões no celular, sem planilhas gigantes e sem precisar descobrir a ordem sozinha.</p>
                <ul className="offerList">
                  <li>✓ Jornada guiada para o seu momento</li>
                  <li>✓ Valor possível, convidados e fornecedores organizados</li>
                  <li>✓ Responsabilidades e decisões organizadas</li>
                  <li>✓ Acesso pelo navegador, no celular ou computador</li>
                </ul>
              </div>

              <aside className="priceCard">
                <p className="cardLabel">NOIVA SEM SURTO</p>
                <p className="priceIntro">Acesso ao mini app por</p>
                <div className="price"><span>R$</span><strong>29</strong><span>,90</span></div>
                <p className="paymentNote">pagamento único</p>
                <CheckoutButton busy={checkoutBusy} href={checkoutHref} onClick={handleCheckoutClick}>
                  QUERO ORGANIZAR SEM SURTO
                </CheckoutButton>
                <p className="secureNote">Pagamento processado com segurança pela Kiwify.</p>
              </aside>
            </div>
          </section>

          <section className="faqSection">
            <div className="container faqGrid">
              <div>
                <p className="eyebrow"><span /> ANTES DE CONTINUAR</p>
                <h2>Dúvidas comuns</h2>
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
              <p className="eyebrow centered light"><span /> SUA PRÓXIMA DECISÃO JÁ APARECEU <span /></p>
              <h2>Agora transforme clareza em caminho.</h2>
              <p>Acesse o Noiva Sem Surto por R$ 29,90.</p>
              <CheckoutButton className="lightButton" busy={checkoutBusy} href={checkoutHref} onClick={handleCheckoutClick}>
                COMEÇAR MEU PLANEJAMENTO
              </CheckoutButton>
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
