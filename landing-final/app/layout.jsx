import Script from "next/script";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import "./upgrade.css";
import "./checkin.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata = {
  title: "Noiva Sem Surto — Uma decisão de cada vez",
  description:
    "Responda 3 perguntas rápidas, descubra o que organizar primeiro e continue o planejamento com uma rota clara.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Noiva Sem Surto",
    description:
      "Você não precisa organizar tudo agora. Precisa descobrir o que vem primeiro.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080708",
};

const pixelCode = `
  (function () {
    if (window.__nssMetaPixelInitialized) return;
    window.__nssMetaPixelInitialized = true;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '3331832193668276');
    fbq('track', 'PageView');

    (window.__nssPendingPixelEvents || []).forEach(function (event) {
      fbq('trackCustom', event[0], event[1]);
    });
    window.__nssPendingPixelEvents = [];
  })();
`;

const quizLanguageCode = `
  (function () {
    if (window.__nssQuizLanguagePatch) return;
    window.__nssQuizLanguagePatch = true;

    var replacements = new Map([
      ['FAZER CHECK-IN', 'RESPONDER AGORA'],
      ['CHECK-IN DE ORGANIZAÇÃO', '3 PERGUNTAS. UMA DIREÇÃO.'],
      ['FAZER MEU CHECK-IN', 'QUERO RESPONDER 💜'],
      ['SEU CHECK-IN DE ORGANIZAÇÃO', 'ME CONTA COMO TÁ SEU CASAMENTO'],
      ['MONTANDO SEU CHECK-IN…', 'ORGANIZANDO SUAS RESPOSTAS…'],
      ['VER MEU CHECKLIST', 'VER O QUE FAZER PRIMEIRO'],
      ['SALVAR E CONTINUAR', 'PRÓXIMA PERGUNTA'],
      ['SEU CHECK-IN ESTÁ PRONTO', 'SUA ROTA ESTÁ PRONTA'],
      ['↻ Refazer meu check-in', '↻ Responder novamente'],
      ['Descubra o que merece sua atenção primeiro.', 'Me conta como tá seu casamento.'],
      ['Marque 3 respostas rápidas e receba um checklist personalizado com sua prioridade, seus próximos passos e o que pode esperar.', 'Me responde 3 coisinhas sobre o momento do seu casamento e eu te mostro o que organizar primeiro, o que pode esperar e qual deve ser seu próximo passo.'],
      ['Sem cadastro · 3 respostas · resultado na hora', 'Leva menos de 1 minuto · sem cadastro · resultado na hora'],
      ['3 respostas · sem cadastro · resultado na hora', '3 perguntas rápidas · resultado na hora'],
      ['✓ 3 respostas', '✓ Só 3 perguntas'],
      ['✓ Sem formulário longo', '✓ Você só escolhe uma opção'],
      ['✓ Checklist personalizado', '✓ Direção personalizada']
    ]);

    var shortDescriptions = {
      'Sou a noiva': 'Já estou organizando meu casamento.',
      'Ainda não estou noiva, mas já quero me organizar': 'Quero começar com calma e me preparar antes.',
      'Minhas bodas merecem organização': 'Quero organizar essa celebração sem transformar tudo em correria.',
      'Não sei por onde começar': 'Tem tanta coisa que eu não sei qual vem primeiro.',
      'Tenho medo de gastar mais do que deveria': 'Quero organizar sem perder o controle do orçamento.',
      'A lista de convidados está me travando': 'Convidados estão travando outras decisões.',
      'Não sei o que contratar primeiro': 'Estou pesquisando, mas não sei quem fechar agora.',
      'Tenho muitas ideias, mas nada organizado': 'Tenho referências, mas ainda não tenho uma ordem.',
      'Estou organizando praticamente tudo sozinha': 'As decisões estão ficando todas comigo.',
      'Ainda estou no começo': 'Ainda não tenho uma base definida.',
      'Já temos uma data': 'A data existe, mas o restante ainda está solto.',
      'Já estou pesquisando e pedindo orçamentos': 'Já comecei a olhar preços e fornecedores.',
      'Já temos algumas coisas resolvidas': 'Algumas decisões estão fechadas, mas ainda falta controle.',
      'Faltam poucos meses e ainda há pendências': 'Preciso separar o urgente do que pode esperar.'
    };

    var scheduled = false;

    function replaceTextNodes(root) {
      if (!root) return;
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach(function (node) {
        var raw = node.nodeValue || '';
        var clean = raw.trim();
        if (!replacements.has(clean)) return;
        var leading = (raw.match(/^\\s*/) || [''])[0];
        var trailing = (raw.match(/\\s*$/) || [''])[0];
        node.nodeValue = leading + replacements.get(clean) + trailing;
      });
    }

    function applyQuizLanguage() {
      scheduled = false;
      replaceTextNodes(document.body);

      var kicker = document.querySelector('.checkinKicker');
      if (kicker && kicker.textContent !== 'ME CONTA COMO TÁ SEU CASAMENTO') {
        kicker.textContent = 'ME CONTA COMO TÁ SEU CASAMENTO';
      }

      var helper = document.querySelector('.quizHelper');
      if (helper && helper.textContent !== 'Escolha só uma opção — a que mais combina com você agora.') {
        helper.textContent = 'Escolha só uma opção — a que mais combina com você agora.';
      }

      document.querySelectorAll('.optionCopy').forEach(function (copy) {
        var title = copy.querySelector('strong');
        var description = copy.querySelector('small');
        if (!title || !description) return;
        var replacement = shortDescriptions[title.textContent.trim()];
        if (replacement && description.textContent !== replacement) {
          description.textContent = replacement;
        }
      });

      var options = document.querySelector('.optionList.checklistOptions');
      if (options) {
        var previous = options.previousElementSibling;
        if (!previous || !previous.classList.contains('quizPromptBadge')) {
          var prompt = document.createElement('p');
          prompt.className = 'quizPromptBadge';
          prompt.textContent = '👆 Escolha uma resposta para continuar';
          options.parentNode.insertBefore(prompt, options);
        }
      }

      var reassurance = document.querySelector('.checkinReassurance');
      if (reassurance && reassurance.textContent !== 'Escolha a resposta que mais parece com você. Não existe resposta certa.') {
        reassurance.textContent = 'Escolha a resposta que mais parece com você. Não existe resposta certa.';
      }
    }

    function scheduleApply() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(applyQuizLanguage);
    }

    applyQuizLanguage();
    var observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        {children}
        <Script id="nss-quiz-language" strategy="afterInteractive">
          {quizLanguageCode}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {pixelCode}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=3331832193668276&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}
