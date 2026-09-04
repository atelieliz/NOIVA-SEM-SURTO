export type DiagnosticOption = {
  value: string;
  emoji: string;
  label: string;
  description?: string;
};

export type DiagnosticQuestion = {
  id: "celebration" | "pain" | "phase";
  eyebrow: string;
  question: string;
  helper?: string;
  options: DiagnosticOption[];
};

export type DiagnosticAnswers = Partial<Record<DiagnosticQuestion["id"], string>>;

export type DiagnosticResult = {
  momentTitle: string;
  description: string;
  risk: string;
  priorityTitle: string;
  priorityExplanation: string;
  priorityImpacts: string[];
  nextSteps: string[];
  canWait: string[];
  reassurance: string;
};

export const DIAGNOSTIC_STORAGE_KEY = "nss_route_v4";

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "celebration",
    eyebrow: "1 · Seu momento",
    question: "Qual dessas frases parece mais com você hoje?",
    helper: "Não precisa ter tudo decidido. Marque apenas a opção que melhor descreve seu momento.",
    options: [
      {
        value: "bride",
        emoji: "👰",
        label: "Sou a noiva",
        description: "Meu casamento já faz parte da minha realidade e eu quero organizar as decisões sem me perder.",
      },
      {
        value: "planning_ahead",
        emoji: "💍",
        label: "Ainda não estou noiva, mas já quero me organizar",
        description: "Quero entender o que faz sentido antes de começar a gastar, pesquisar e decidir.",
      },
      {
        value: "anniversary",
        emoji: "🥂",
        label: "Minhas bodas merecem organização",
        description: "Quero celebrar nossa história com carinho, estrutura e sem transformar tudo em correria.",
      },
    ],
  },
  {
    id: "pain",
    eyebrow: "2 · Sua prioridade",
    question: "O que mais está te deixando perdida agora?",
    helper: "Escolha só uma. A ideia é descobrir qual decisão merece sua atenção primeiro.",
    options: [
      {
        value: "start",
        emoji: "🧭",
        label: "Não sei por onde começar",
        description: "Tem tanta coisa para pensar que eu não sei qual decisão vem primeiro.",
      },
      {
        value: "budget",
        emoji: "💸",
        label: "Tenho medo de gastar mais do que deveria",
        description: "Quero organizar o sonho sem perder o controle do orçamento.",
      },
      {
        value: "guests",
        emoji: "👥",
        label: "A lista de convidados está me travando",
        description: "Não sei quem chamar, quantas pessoas considerar ou como isso afeta o restante.",
      },
      {
        value: "suppliers",
        emoji: "🤝",
        label: "Não sei o que contratar primeiro",
        description: "Estou vendo fornecedores, mas não sei qual contratação realmente precisa acontecer agora.",
      },
      {
        value: "ideas",
        emoji: "📌",
        label: "Tenho muitas ideias, mas nada organizado",
        description: "Salvei referências e possibilidades, mas ainda não consegui transformar isso em um plano.",
      },
      {
        value: "alone",
        emoji: "🙋‍♀️",
        label: "Estou organizando praticamente tudo sozinha",
        description: "As decisões e informações estão ficando concentradas demais em mim.",
      },
    ],
  },
  {
    id: "phase",
    eyebrow: "3 · Seu andamento",
    question: "O que já está encaminhado hoje?",
    helper: "Isso ajuda o Noiva Sem Surto a separar o que é prioridade do que ainda pode esperar.",
    options: [
      {
        value: "idea",
        emoji: "🌱",
        label: "Ainda estou no começo",
        description: "Tenho o desejo, mas ainda não existe uma base clara ou uma data definida.",
      },
      {
        value: "date",
        emoji: "📅",
        label: "Já temos uma data",
        description: "A data existe, mas ainda falta transformar isso em uma sequência de decisões.",
      },
      {
        value: "research",
        emoji: "🔎",
        label: "Já estou pesquisando e pedindo orçamentos",
        description: "Já comecei a olhar possibilidades, valores e fornecedores.",
      },
      {
        value: "booked",
        emoji: "✅",
        label: "Já temos algumas coisas resolvidas",
        description: "Algumas decisões foram tomadas, mas eu preciso enxergar melhor o que ainda falta.",
      },
      {
        value: "urgent",
        emoji: "⏰",
        label: "Faltam poucos meses e ainda há pendências",
        description: "Agora eu preciso saber o que é realmente urgente para não gastar energia no lugar errado.",
      },
    ],
  },
];

const celebrationNames: Record<string, string> = {
  bride: "casamento",
  planning_ahead: "futuro casamento",
  anniversary: "bodas",
};

const impactMap: Record<string, string[]> = {
  budget: ["lista de convidados", "local", "fornecedores", "possibilidades reais"],
  guests: ["orçamento", "capacidade do local", "alimentação", "formato da comemoração"],
  suppliers: ["cronograma", "contratos", "orçamento", "segurança das próximas escolhas"],
  structure: ["orçamento", "local", "fornecedores", "ordem das decisões"],
  responsibilities: ["prazos", "sobrecarga", "tarefas do casal", "continuidade do planejamento"],
};

function getPhaseProfile(phase = "", celebration = "") {
  if (celebration === "planning_ahead") {
    return {
      title: "Você está se organizando antes da correria começar",
      description:
        "Esse é um ótimo momento para entender a ordem das decisões antes que referências, orçamentos e expectativas comecem a disputar sua atenção.",
    };
  }

  if (celebration === "anniversary" && phase === "idea") {
    return {
      title: "Suas bodas estão começando a ganhar forma",
      description:
        "A vontade de celebrar já existe. Agora vale transformar essa intenção em uma estrutura que combine com a história e com o momento atual do casal.",
    };
  }

  if (phase === "idea") {
    return {
      title: "Seu planejamento ainda precisa de uma base clara",
      description:
        "O desejo já existe, mas ainda falta uma estrutura inicial para transformar ideias em decisões seguras.",
    };
  }
  if (phase === "date") {
    return {
      title: "Você já tem um prazo real — agora precisa de direção",
      description:
        "A data já organiza o calendário, mas as próximas escolhas precisam entrar em uma sequência que proteja tempo e orçamento.",
    };
  }
  if (phase === "research") {
    return {
      title: "Você já começou a pesquisar, mas precisa de critérios",
      description:
        "Referências e orçamentos já estão aparecendo. Agora o mais importante é saber o que comparar, decidir ou deixar para depois.",
    };
  }
  if (phase === "booked") {
    return {
      title: "O planejamento já começou — falta enxergar o todo",
      description:
        "Algumas decisões já foram tomadas. O próximo passo é conectar contratos, orçamento e prazos para não depender da memória.",
    };
  }
  if (phase === "urgent") {
    return {
      title: "Seu planejamento precisa de uma rota de prioridade",
      description:
        "Com menos tempo, tentar resolver tudo ao mesmo tempo aumenta a sensação de atraso. Agora é hora de proteger as decisões essenciais.",
    };
  }
  return {
    title: "Seu planejamento precisa de uma direção clara",
    description:
      "Você sabe que quer realizar essa celebração, mas ainda não existe uma ordem segura para tomar as decisões.",
  };
}

function getPriority(pain = "", phase = "") {
  if (pain === "budget") {
    return {
      key: "budget",
      title: "Definir um limite inicial de investimento",
      explanation:
        "Sem um limite, cada orçamento parece possível isoladamente, mas o conjunto pode ultrapassar o que o casal consegue sustentar.",
      risk:
        "pesquisar e contratar itens separadamente sem saber quanto cada decisão pode ocupar do orçamento total.",
      steps: [
        "Definir quanto o casal consegue investir sem comprometer outras prioridades.",
        "Separar esse valor em categorias essenciais e opcionais.",
        "Usar o limite como filtro antes de pedir novos orçamentos.",
      ],
    };
  }

  if (pain === "guests") {
    return {
      key: "guests",
      title: "Criar a primeira lista sem cortes",
      explanation:
        "Antes de excluir pessoas, vocês precisam enxergar o tamanho real do sonho. Só depois faz sentido ajustar a lista ao orçamento e ao espaço.",
      risk:
        "escolher local, buffet ou estrutura sem uma lista-base e precisar refazer decisões depois.",
      steps: [
        "Colocar todos os nomes que o casal imagina presentes.",
        "Organizar os convidados por vínculo e prioridade.",
        "Cruzar a primeira lista com orçamento e capacidade do local.",
      ],
    };
  }

  if (pain === "suppliers") {
    return {
      key: "suppliers",
      title: "Definir a ordem real das contratações",
      explanation:
        "Nem todos os fornecedores precisam ser contratados agora. A ordem depende do prazo, do formato e das decisões que destravam as demais.",
      risk:
        "fechar fornecedores por ansiedade ou preço sem avaliar dependências, contrato, logística e impacto no orçamento.",
      steps: [
        "Confirmar formato, data e quantidade aproximada de pessoas.",
        "Listar os fornecedores que dependem dessas definições.",
        "Comparar primeiro os contratos com maior impacto e menor disponibilidade.",
      ],
    };
  }

  if (pain === "alone") {
    return {
      key: "responsibilities",
      title: "Dividir responsabilidades antes de acumular tarefas",
      explanation:
        "Organizar sozinha transforma cada pequena decisão em mais uma obrigação. A rota precisa mostrar o que fazer e quem será responsável.",
      risk:
        "centralizar informações, prazos e decisões até o planejamento depender exclusivamente da sua energia.",
      steps: [
        "Listar as três decisões mais urgentes do momento.",
        "Definir quem pesquisa, quem decide e quem acompanha cada uma.",
        "Criar um único lugar para registrar prazos e informações.",
      ],
    };
  }

  if (pain === "ideas") {
    return {
      key: "structure",
      title: "Transformar referências em uma estrutura de celebração",
      explanation:
        "As ideias começam a ajudar quando são organizadas por formato, prioridade e limite. Antes disso, elas competem entre si.",
      risk:
        "gastar tempo e dinheiro em detalhes que não combinam com a estrutura final da celebração.",
      steps: [
        "Definir como vocês querem que a celebração seja sentida.",
        "Escolher formato, tamanho aproximado e limite inicial.",
        "Guardar apenas as referências compatíveis com essas decisões.",
      ],
    };
  }

  if (phase === "urgent") {
    return {
      key: "structure",
      title: "Montar uma rota crítica para os próximos dias",
      explanation:
        "Com pouco tempo, a prioridade é identificar decisões que impedem outras etapas e concluir uma de cada vez.",
      risk:
        "tentar compensar o atraso fazendo tudo ao mesmo tempo e deixar pendências essenciais escondidas entre detalhes.",
      steps: [
        "Listar o que ainda impede a realização da cerimônia ou recepção.",
        "Ordenar essas pendências por prazo e dependência.",
        "Concluir a primeira decisão antes de adicionar novos detalhes.",
      ],
    };
  }

  return {
    key: "structure",
    title: "Definir o tamanho e o formato real da celebração",
    explanation:
      "Essa decisão cria a base para estimar orçamento, escolher local, organizar convidados e saber quais fornecedores pesquisar primeiro.",
    risk:
      "pesquisar detalhes e fornecedores antes de definir a estrutura principal da celebração.",
    steps: [
      "Definir um limite inicial de investimento.",
      "Criar a primeira lista de convidados sem cortes.",
      "Escolher o formato e o tamanho aproximado da celebração.",
    ],
  };
}

export function createDiagnosticResult(answers: DiagnosticAnswers): DiagnosticResult {
  const celebration = celebrationNames[answers.celebration ?? ""] ?? "celebração";
  const phaseProfile = getPhaseProfile(answers.phase, answers.celebration);
  const priority = getPriority(answers.pain, answers.phase);
  const urgent = answers.phase === "urgent";

  return {
    momentTitle: phaseProfile.title,
    description: `${phaseProfile.description} Para o seu ${celebration}, a clareza começa pela próxima decisão — não por uma lista gigante.`,
    risk: priority.risk,
    priorityTitle: priority.title,
    priorityExplanation: priority.explanation,
    priorityImpacts: impactMap[priority.key] ?? impactMap.structure,
    nextSteps: priority.steps,
    canWait: urgent
      ? [
          "novas ideias que reabrem decisões já tomadas",
          "detalhes decorativos sem impacto na operação",
          "itens extras que não possuem prazo crítico",
        ]
      : [
          "lembranças",
          "papelaria complementar",
          "cabine de fotos e atrações extras",
          "detalhes decorativos que não definem orçamento ou local",
        ],
    reassurance: urgent
      ? "Você não precisa recuperar todo o tempo hoje. Precisa proteger as decisões essenciais e avançar em uma etapa de cada vez."
      : "Você não precisa resolver tudo hoje. Precisa enxergar o que merece sua atenção agora e avançar uma decisão de cada vez.",
  };
}
