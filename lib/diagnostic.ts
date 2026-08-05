export type DiagnosticQuestion = {
  id: "celebration" | "pain" | "phase";
  question: string;
  helper?: string;
  options: string[];
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

export const DIAGNOSTIC_STORAGE_KEY = "nss_route_v3";

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "celebration",
    question: "Qual celebração você quer tirar do papel?",
    options: [
      "Meu casamento.",
      "Casamento civil com comemoração.",
      "Mini wedding ou cerimônia íntima.",
      "Bodas ou renovação de votos.",
      "Ainda estamos decidindo o formato.",
    ],
  },
  {
    id: "pain",
    question: "Onde o planejamento começa a sair do controle?",
    helper: "Escolha a situação que mais parece com o que você está vivendo.",
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
    id: "phase",
    question: "Em qual fase sua celebração está?",
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

const celebrationNames: Record<string, string> = {
  "Meu casamento.": "casamento",
  "Casamento civil com comemoração.": "casamento civil com comemoração",
  "Mini wedding ou cerimônia íntima.": "celebração íntima",
  "Bodas ou renovação de votos.": "bodas ou renovação de votos",
  "Ainda estamos decidindo o formato.": "celebração",
};

const impactMap: Record<string, string[]> = {
  budget: ["lista de convidados", "local", "fornecedores", "possibilidades reais"],
  guests: ["orçamento", "capacidade do local", "alimentação", "formato da comemoração"],
  suppliers: ["cronograma", "contratos", "orçamento", "segurança das próximas escolhas"],
  structure: ["orçamento", "local", "fornecedores", "ordem das decisões"],
  responsibilities: ["prazos", "sobrecarga", "tarefas do casal", "continuidade do planejamento"],
};

function getPhaseProfile(phase = "") {
  if (phase === "Ainda é uma ideia, sem data definida.") {
    return {
      title: "Planejamento ainda sem uma base clara",
      description:
        "A celebração já existe como desejo, mas ainda falta uma estrutura inicial para transformar ideias em decisões seguras.",
    };
  }
  if (phase === "Já temos uma data, mas quase nada organizado.") {
    return {
      title: "Data definida, mas planejamento sem direção",
      description:
        "A data já cria um prazo real, mas as próximas escolhas ainda não estão organizadas em uma sequência que proteja tempo e orçamento.",
    };
  }
  if (phase === "Já começamos a pesquisar e pedir orçamentos.") {
    return {
      title: "Muita pesquisa, pouca ordem de decisão",
      description:
        "Você já está buscando referências e valores, mas precisa de critérios para saber o que comparar, contratar ou deixar para depois.",
    };
  }
  if (phase === "Já contratamos algumas coisas, mas falta controle.") {
    return {
      title: "Planejamento em andamento, mas sem visão do todo",
      description:
        "Algumas decisões já foram tomadas, porém ainda falta conectar contratos, orçamento e próximos prazos em uma única rota.",
    };
  }
  if (phase === "Faltam poucos meses e estamos atrasados.") {
    return {
      title: "Planejamento sob pressão de prazo",
      description:
        "Agora não é hora de tentar fazer tudo. É hora de separar o que realmente interfere na realização da celebração do que é apenas desejável.",
    };
  }
  if (phase === "Estamos reorganizando tudo para bodas ou renovação.") {
    return {
      title: "Celebração em fase de reconstrução",
      description:
        "Vocês já têm uma história e uma intenção, mas precisam adaptar formato, prioridades e orçamento ao momento atual do casal.",
    };
  }
  return {
    title: "Planejamento sem direção clara",
    description:
      "Você sabe que quer realizar essa celebração, mas ainda não existe uma ordem segura para tomar as decisões.",
  };
}

function getPriority(pain = "", phase = "") {
  if (pain === "Tenho medo de gastar mais do que podemos.") {
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

  if (pain === "A lista de convidados está virando um problema.") {
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

  if (pain === "Não sei quais fornecedores contratar primeiro.") {
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

  if (pain === "Estou organizando praticamente tudo sozinha.") {
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

  if (pain === "Tenho muitas ideias, mas nenhum plano.") {
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

  if (phase === "Faltam poucos meses e estamos atrasados.") {
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
  const phaseProfile = getPhaseProfile(answers.phase);
  const priority = getPriority(answers.pain, answers.phase);
  const urgent = answers.phase === "Faltam poucos meses e estamos atrasados.";

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
      : "Você não está atrasada para tudo. Só precisa parar de tratar todas as decisões como se tivessem a mesma urgência.",
  };
}
