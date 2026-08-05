export type DiagnosticQuestion = {
  id: string;
  question: string;
  options: string[];
};

export type DiagnosticAnswers = Record<string, string>;

export type DiagnosticResult = {
  profile: string;
  description: string;
  risk: string;
  nextSteps: string[];
  canWait: string[];
  reassurance: string;
};

export const DIAGNOSTIC_STORAGE_KEY = "nss_diagnostic_v2";

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "moment",
    question: "Em qual momento vocês estão?",
    options: [
      "O pedido aconteceu e ainda não começamos.",
      "Já pesquisamos algumas coisas.",
      "Já definimos data ou orçamento.",
      "Já contratamos fornecedores.",
      "O casamento está próximo e estamos atrasados.",
    ],
  },
  {
    id: "timeline",
    question: "Quanto tempo falta para o casamento?",
    options: [
      "Menos de 3 meses.",
      "De 3 a 6 meses.",
      "De 6 a 12 meses.",
      "Mais de 1 ano.",
      "Ainda não temos data.",
    ],
  },
  {
    id: "size",
    question: "Qual será aproximadamente o tamanho do casamento?",
    options: [
      "Até 30 pessoas.",
      "De 31 a 60.",
      "De 61 a 100.",
      "De 101 a 150.",
      "Mais de 150.",
      "Ainda não sabemos.",
    ],
  },
  {
    id: "budget",
    question: "Vocês já definiram um limite de orçamento?",
    options: [
      "Sim, temos um limite claro.",
      "Temos uma estimativa.",
      "Estamos tentando descobrir.",
      "Ainda não conversamos sobre isso.",
    ],
  },
  {
    id: "concern",
    question: "Qual decisão mais preocupa você hoje?",
    options: [
      "Orçamento.",
      "Lista de convidados.",
      "Local.",
      "Fornecedores.",
      "Organização das tarefas.",
      "Opiniões da família.",
      "Não sei por onde começar.",
    ],
  },
  {
    id: "organizer",
    question: "Quem está organizando o casamento?",
    options: [
      "Principalmente eu.",
      "Eu e meu noivo ou noiva.",
      "A família está ajudando.",
      "Temos assessoria.",
      "Ainda não dividimos as responsabilidades.",
    ],
  },
  {
    id: "feeling",
    question: "Como você se sente quando pensa no planejamento?",
    options: [
      "Perdida.",
      "Ansiosa.",
      "Atrasada.",
      "Sobrecarregada.",
      "Animada, mas sem direção.",
      "Relativamente organizada.",
    ],
  },
  {
    id: "goal",
    question: "O que você mais quer conquistar agora?",
    options: [
      "Clareza.",
      "Controle do orçamento.",
      "Uma lista organizada.",
      "Segurança para contratar.",
      "Um cronograma.",
      "Parar de sentir que estou esquecendo algo.",
    ],
  },
];

function addUnique(list: string[], item: string) {
  if (!list.includes(item)) list.push(item);
}

export function createDiagnosticResult(answers: DiagnosticAnswers): DiagnosticResult {
  const moment = answers.moment;
  const timeline = answers.timeline;
  const feeling = answers.feeling;
  const budget = answers.budget;
  const size = answers.size;
  const concern = answers.concern;
  const organizer = answers.organizer;

  const isUnderPressure =
    moment === "O casamento está próximo e estamos atrasados." ||
    (timeline === "Menos de 3 meses." &&
      ["Ansiosa.", "Atrasada.", "Sobrecarregada.", "Perdida."].includes(feeling));

  const isAlmostReady =
    timeline === "Menos de 3 meses." &&
    ["Já contratamos fornecedores.", "Já definimos data ou orçamento."].includes(moment) &&
    !isUnderPressure;

  let profile = "Noiva no Começo";
  let description =
    "Você está no momento de transformar ideias soltas em uma base segura. Antes de pesquisar tudo, vale definir as decisões que sustentam o restante do casamento.";

  if (isUnderPressure) {
    profile = "Noiva Sob Pressão";
    description =
      "O prazo e a quantidade de decisões abertas estão competindo pela sua atenção. Seu plano precisa separar o indispensável do que é apenas desejável.";
  } else if (isAlmostReady) {
    profile = "Noiva Quase Pronta";
    description =
      "A estrutura principal já existe. Agora o foco deve ser confirmar detalhes críticos, responsáveis e prazos sem reabrir decisões que já estão resolvidas.";
  } else if (moment === "Já contratamos fornecedores.") {
    profile = "Noiva em Construção";
    description =
      "Você já avançou nas contratações, mas ainda precisa conectar fornecedores, orçamento e cronograma para evitar lacunas e retrabalho.";
  } else if (
    moment === "Já pesquisamos algumas coisas." ||
    moment === "Já definimos data ou orçamento."
  ) {
    profile = "Noiva em Estruturação";
    description =
      "Você já começou a planejar, mas algumas decisões importantes ainda não estão servindo de base para as próximas escolhas.";
  }

  let risk =
    "tratar todas as tarefas como igualmente urgentes e gastar energia em detalhes que ainda não precisam ser decididos.";

  if (budget !== "Sim, temos um limite claro.") {
    risk =
      "contratar fornecedores antes de definir um limite financeiro que proteja as escolhas seguintes.";
  } else if (size === "Ainda não sabemos." || concern === "Lista de convidados.") {
    risk =
      "escolher local ou fornecedores sem uma lista-base, criando custo extra e necessidade de refazer decisões.";
  } else if (concern === "Fornecedores.") {
    risk =
      "comparar fornecedores apenas por preço e deixar de avaliar contrato, segurança, logística e plano B.";
  } else if (concern === "Local.") {
    risk =
      "fechar um espaço antes de cruzar capacidade, orçamento, deslocamento e formato real do casamento.";
  } else if (concern === "Opiniões da família.") {
    risk =
      "permitir que opiniões externas alterem decisões que deveriam seguir o limite, a prioridade e o desejo do casal.";
  }

  const nextSteps: string[] = [];

  if (timeline === "Ainda não temos data.") {
    addUnique(nextSteps, "Definir uma janela possível para o casamento.");
  }
  if (budget !== "Sim, temos um limite claro.") {
    addUnique(nextSteps, "Definir o limite financeiro do casal.");
  }
  if (size === "Ainda não sabemos." || concern === "Lista de convidados.") {
    addUnique(nextSteps, "Criar a primeira lista de convidados sem cortes.");
  }
  if (concern === "Local.") {
    addUnique(nextSteps, "Definir capacidade, região e teto do local antes das visitas.");
  }
  if (concern === "Fornecedores.") {
    addUnique(nextSteps, "Escolher quais fornecedores precisam ser cotados primeiro.");
  }
  if (concern === "Organização das tarefas." || answers.goal === "Um cronograma.") {
    addUnique(nextSteps, "Separar tarefas por prazo e dependência, não por ansiedade.");
  }
  if (concern === "Opiniões da família.") {
    addUnique(nextSteps, "Alinhar com o casal quais decisões aceitam opinião externa.");
  }
  if (organizer === "Ainda não dividimos as responsabilidades.") {
    addUnique(nextSteps, "Dividir responsáveis pelas próximas decisões.");
  }

  addUnique(nextSteps, "Definir o formato essencial do casamento.");
  addUnique(nextSteps, "Registrar o que já está decidido e o que ainda está aberto.");
  addUnique(nextSteps, "Escolher apenas a próxima decisão que destrava as demais.");

  const canWait =
    timeline === "Menos de 3 meses."
      ? [
          "extras decorativos que não afetam a operação",
          "novas ideias que reabrem contratos já fechados",
          "detalhes opcionais sem prazo crítico",
        ]
      : [
          "lembranças",
          "papelaria complementar",
          "cabine de fotos e atrações extras",
          "detalhes decorativos que não definem local ou orçamento",
        ];

  const reassurance = isUnderPressure
    ? "Você não precisa recuperar todo o tempo hoje. Precisa proteger as próximas decisões e concluir uma etapa de cada vez."
    : feeling === "Relativamente organizada."
      ? "Você já tem uma boa base. A clareza agora vem de manter a ordem das decisões, sem adicionar tarefas desnecessárias."
      : "Você não precisa ter todas as respostas agora. Quando a ordem fica clara, o planejamento deixa de parecer uma única tarefa impossível.";

  return {
    profile,
    description,
    risk,
    nextSteps: nextSteps.slice(0, 3),
    canWait,
    reassurance,
  };
}
