"use client";

import { useEffect, useMemo, useState } from "react";
import "./organizador.css";

const STORE = "nss-organizador-v1";
const GROUPS = ["Família da noiva", "Família do noivo", "Amigos", "Trabalho"];
const BASE_CATEGORIES = [
  ["Decoração", 9], ["Vestido", 10], ["Lugar", 16], ["Cerimônia", 7],
  ["Extras", 5], ["Bolo", 5], ["Lembrancinhas", 3], ["Buffet", 20],
  ["Coquetel", 8], ["DJ / banda", 7],
];
const DEFAULTS = {
  started: false,
  moment: { event: "Casamento", priority: "Tenho medo de gastar demais", phase: "Ainda é uma ideia", date: "", certain: false },
  budget: { target: 0, saved: 0, monthly: 0, categories: BASE_CATEGORIES.map(([name, weight], i) => ({ id: `base-${i}`, name, weight, actual: 0 })) },
  guests: { target: 100, people: [] },
  vendors: [], tasks: [], celebration: { format: "Ainda estamos escolhendo", details: "", location: "" },
  compassAnswers: {}, rsvp: { brideName: "", bridePhone: "" },
};

const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(value) || 0);
const numberValue = (value) => Math.max(0, Number(String(value).replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".")) || 0);
const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;

function loadState() {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE) || "null");
    return parsed ? { ...DEFAULTS, ...parsed, moment: { ...DEFAULTS.moment, ...parsed.moment }, budget: { ...DEFAULTS.budget, ...parsed.budget }, guests: { ...DEFAULTS.guests, ...parsed.guests }, celebration: { ...DEFAULTS.celebration, ...parsed.celebration }, rsvp: { ...DEFAULTS.rsvp, ...parsed.rsvp } } : DEFAULTS;
  } catch { return DEFAULTS; }
}

function Icon({ children }) { return <span className="ns-icon" aria-hidden="true">{children}</span>; }
function Field({ label, ...props }) { return <label className="ns-field"><span>{label}</span><input {...props} /></label>; }
function MoneyField({ label, value, onChange, hint }) { return <label className="ns-field"><span>{label}</span><div className="ns-money"><span>R$</span><input inputMode="decimal" value={value || ""} onChange={(event) => onChange(numberValue(event.target.value))} placeholder="0" /></div>{hint && <small>{hint}</small>}</label>; }

export default function OrganizadorPage() {
  const [data, setData] = useState(DEFAULTS);
  const [view, setView] = useState("inicio");
  const [hydrated, setHydrated] = useState(false);
  const [guestDraft, setGuestDraft] = useState({ name: "", group: GROUPS[0] });
  const [guestStage, setGuestStage] = useState("lista");
  const [resourceTab, setResourceTab] = useState("investimento");
  const [eventTab, setEventTab] = useState("formato");
  const [pasteText, setPasteText] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [vendorDraft, setVendorDraft] = useState({ name: "", category: "", value: "", responsible: "" });
  const [taskDraft, setTaskDraft] = useState("");
  const [bridePhone, setBridePhone] = useState("");
  const [brideName, setBrideName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { const loaded = loadState(); setData(loaded); setBrideName(loaded.rsvp.brideName); setBridePhone(loaded.rsvp.bridePhone); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORE, JSON.stringify(data)); }, [data, hydrated]);

  const budget = data.budget || DEFAULTS.budget;
  const target = Number(budget.target) || 0;
  const saved = Number(budget.saved) || 0;
  const monthly = Number(budget.monthly) || 0;
  const categories = budget.categories || [];
  const weightTotal = categories.reduce((sum, item) => sum + (Number(item.weight) || 0), 0) || 1;
  const totalActual = categories.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);
  const available = target;
  const remaining = target - totalActual;
  const activeGuests = data.guests.people.filter((person) => !person.removed);
  const guestReviewComplete = activeGuests.length > 0 && activeGuests.every((person) => ["Essencial", "Importante", "Pode rever"].includes(person.importance));
  const groupsCount = GROUPS.map((group) => ({ group, count: activeGuests.filter((person) => person.group === group).length }));
  const guestGap = activeGuests.length - (Number(data.guests.target) || 0);
  const bestFirstStep = useMemo(() => {
    const largest = [...groupsCount].sort((a, b) => b.count - a.count)[0];
    if (guestGap <= 0) return "A lista está dentro da quantidade prevista. Você pode revisar os nomes com calma.";
    return `Comece conversando sobre o grupo “${largest?.group || "Amigos"}”, que hoje tem mais nomes. A lista continua inteira enquanto vocês decidem.`;
  }, [groupsCount, guestGap]);
  const advisor = useMemo(() => {
    if (!target) return { title: "Defina um limite confortável", detail: "Sem um teto inicial, qualquer orçamento pode parecer urgente.", reason: "O limite orienta a lista de pessoas, o formato e as conversas com fornecedores.", action: "Definir meu orçamento", view: "recursos", tab: "investimento" };
    if (!activeGuests.length) return { title: "Coloque as pessoas no papel", detail: "Comece listando sem cortar ninguém. Depois vocês revisam juntos quem é essencial.", reason: "A quantidade de convidados influencia espaço, alimentação e investimento.", action: "Organizar convidados", view: "recursos", tab: "convidados" };
    if (guestGap > 0) return { title: "Revise a previsão de pessoas", detail: `Há ${guestGap} nomes acima da quantidade que vocês imaginaram. A lista continua salva enquanto conversam.`, reason: "Ajustar a previsão evita comparar opções com números diferentes.", action: "Revisar convidados", view: "recursos", tab: "convidados" };
    if (data.celebration.format === "Ainda estamos escolhendo") return { title: "Escolha um formato possível", detail: "Não precisa decidir cada detalhe. Escolha o tipo de momento que faz sentido por enquanto.", reason: "O formato ajuda a definir quais serviços realmente precisam ser pesquisados.", action: "Pensar no formato", view: "evento", tab: "formato" };
    if (!data.vendors.length) return { title: "Compare o primeiro serviço", detail: "Registre o que estão pesquisando e quem vai acompanhar o próximo contato.", reason: "Uma decisão com responsável e valor anotado fica mais fácil de retomar.", action: "Organizar fornecedores", view: "evento", tab: "fornecedores" };
    return { title: "Retome a próxima ação", detail: "Seu plano está organizado. Escolha uma tarefa pequena e marque quem vai cuidar dela.", reason: "Uma ação clara evita que tudo dependa da memória ou fique acumulado.", action: "Abrir minha rota", view: "rota", tab: "" };
  }, [target, activeGuests.length, guestGap, data.celebration.format, data.vendors.length]);

  function update(updater) { setData((current) => typeof updater === "function" ? updater(current) : ({ ...current, ...updater })); }
  function setMoment(key, value) { update((current) => ({ ...current, moment: { ...current.moment, [key]: value } })); }
  function setBudget(key, value) { update((current) => ({ ...current, budget: { ...current.budget, [key]: value } })); }
  function updateRsvp(key, value) { if (key === "brideName") setBrideName(value); else setBridePhone(value); update((current) => ({ ...current, rsvp: { ...current.rsvp, [key]: value } })); }
  function go(next) { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function openResources(tab = "investimento") { setResourceTab(tab); go("recursos"); }
  function openEvent(tab = "formato") { setEventTab(tab); go("evento"); }
  function startRoute() { update((current) => ({ ...current, started: true })); go("momento"); }
  function enterApp() { update((current) => ({ ...current, started: true })); go("inicio"); }

  function addGuest(name = guestDraft.name, group = guestDraft.group) {
    const clean = name.trim(); if (!clean) return;
    update((current) => ({ ...current, guests: { ...current.guests, people: [...current.guests.people, { id: makeId(), name: clean, group, removed: false, reason: "", importance: "Avaliar", review: "" }], reviewed: false } }));
    setGuestDraft({ ...guestDraft, name: "" });
  }
  function importGuests() {
    const names = pasteText.split(/\n|,|;/).map((name) => name.trim()).filter(Boolean);
    if (!names.length) return;
    update((current) => ({ ...current, guests: { ...current.guests, people: [...current.guests.people, ...names.map((name) => ({ id: makeId(), name, group: guestDraft.group, removed: false, reason: "", importance: "Avaliar", review: "" }))], reviewed: false } }));
    setPasteText("");
  }
  function updateGuest(id, patch) { update((current) => ({ ...current, guests: { ...current.guests, people: current.guests.people.map((person) => person.id === id ? { ...person, ...patch } : person), reviewed: false } })); }
  function toggleRemoved(person) {
    if (person.removed) { updateGuest(person.id, { removed: false, reason: "" }); return; }
    const reason = window.prompt(`Por que ${person.name} saiu da lista? O nome ficará guardado em cinza.`, "Não cabe na quantidade planejada");
    if (reason === null) return;
    updateGuest(person.id, { removed: true, reason: reason.trim() || "Revisar mais tarde" });
  }
  function updateCategory(id, patch) { setBudget("categories", categories.map((item) => item.id === id ? { ...item, ...patch } : item)); }
  function addCategory() { const clean = newCategory.trim(); if (!clean) return; setBudget("categories", [...categories, { id: makeId(), name: clean, weight: 5, actual: 0 }]); setNewCategory(""); }
  function removeCategory(id) { setBudget("categories", categories.filter((item) => item.id !== id)); }
  function addVendor(event) { event.preventDefault(); if (!vendorDraft.name.trim()) return; update((current) => ({ ...current, vendors: [...current.vendors, { ...vendorDraft, id: makeId(), value: numberValue(vendorDraft.value), status: "Pesquisar" }] })); setVendorDraft({ name: "", category: "", value: "", responsible: "" }); }
  function addTask(event) { event.preventDefault(); if (!taskDraft.trim()) return; update((current) => ({ ...current, tasks: [...current.tasks, { id: makeId(), text: taskDraft.trim(), done: false }] })); setTaskDraft(""); }
  function rsvpReplyUrl() { const digits = bridePhone.replace(/\D/g, ""); const reply = `Oi! Sobre ${data.moment.event.toLowerCase()} de ${brideName || "[nomes do casal]"}, em ${data.moment.date || "[data]"}: [confirmo / não poderei ir]. Iremos em [número] pessoa(s).`; return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(reply)}` : ""; }
  function rsvpText() { return `Oi! Estamos organizando ${data.moment.event.toLowerCase()} de ${brideName || "[nomes do casal]"}.\n\n📍 Local: ${data.celebration.location || "[local]"}\n📅 Data: ${data.moment.date || "[data]"}\n\nVai ser muito especial ter você com a gente! Para confirmar, toque neste link e envie a resposta para a noiva:\n${rsvpReplyUrl()}\n\nSe puder, responda até [prazo] e informe quantas pessoas irão.`; }
  function plannerSummary() { const active = data.guests.people.filter((person) => !person.removed); const total = categories.reduce((sum, item) => sum + (Number(item.actual) || 0), 0); return `🧭 MEU PLANEJAMENTO — NOIVA SEM SURTO\n\n💍 Momento: ${data.moment.event} · ${data.moment.phase}\n🎯 Prioridade: ${data.moment.priority}\n💰 Limite: ${money(target)} · Guardado: ${money(saved)} · Gasto/orçado: ${money(total)}\n👥 Convidados: ${active.length} de ${data.guests.target} previstos · Essenciais: ${active.filter((person) => person.importance === "Essencial").length}\n🤝 Fornecedores registrados: ${data.vendors.length}\n🥂 Formato: ${data.celebration.format}\n✅ Próximo passo: ${makeRoute(data)[0]}\n\nUm passo de cada vez. Planejamento salvo neste aparelho.`; }
  async function copyPlannerSummary() { try { await navigator.clipboard.writeText(plannerSummary()); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt("Copie o resumo do planejamento:", plannerSummary()); } }
  function plannerWhatsAppUrl() { return `https://wa.me/?text=${encodeURIComponent(plannerSummary())}`; }
  function rsvpUrl() { return rsvpReplyUrl() ? `https://wa.me/?text=${encodeURIComponent(rsvpText())}` : ""; }
  async function copyRsvp() { try { await navigator.clipboard.writeText(rsvpText()); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt("Copie o texto do convite:", rsvpText()); } }

  const routes = [
    ["recursos", "Orçamento e convidados", "💰", "Decida com custo e pessoas à vista"],
    ["evento", "Formato e fornecedores", "🥂", "Defina como será e quem ajuda"],
    ["rota", "Minha rota e resumo", "🧭", "Veja o próximo passo e organize tudo"],
    ["sos", "SOS para imprevistos", "🆘", "Orientação quando algo sair do plano"],
  ];

  if (!hydrated) return <main className="ns-app"><div className="ns-loading">Abrindo seu espaço de planejamento…</div></main>;

  if (!data.started) return <main className="ns-app ns-onboarding">
    <header className="ns-top"><a className="ns-brand" href="#inicio"><span className="ns-brand-mark">N</span><span>Noiva sem Surto</span></a><span className="ns-save-label">Salvo neste aparelho</span></header>
    <section className="ns-welcome">
      <div className="ns-orbit" aria-hidden="true">✦</div><p className="ns-kicker">UM PASSO DE CADA VEZ</p>
      <h1>Uma decisão<br /><em>de cada vez.</em></h1>
      <p className="ns-welcome-title">Parabéns, noiva!</p>
      <p className="ns-lead">O pedido aconteceu. Agora eu vou organizar as decisões na ordem certa e mostrar só o que faz sentido resolver agora.</p>
      <p className="ns-reassure">Respira. Você não precisa saber tudo.<br />Eu te conduzo a partir daqui.</p>
      <button type="button" className="ns-button ns-button-primary" onClick={startRoute}>Começar minha rota <span>→</span></button>
      <p className="ns-footnote">Sem pressa. Suas escolhas ficam salvas neste aparelho.</p>
    </section>
  </main>;

  if (view === "momento") return <main className="ns-app ns-onboarding"><header className="ns-top"><button className="ns-back" onClick={() => go("inicio")}>← <span>Voltar</span></button><span className="ns-step">SEU MOMENTO · 1 DE 1</span></header>
    <section className="ns-moment"><p className="ns-kicker">PONTO DE PARTIDA</p><h1>Meu momento atual</h1><p className="ns-lead">É assim que vocês estão hoje? Isso ajuda a organizar as próximas decisões.</p>
      <div className="ns-moment-list">
        <article className="ns-moment-item"><span>🥂</span><div><small>O que vocês querem celebrar</small><select value={data.moment.event} onChange={(e) => setMoment("event", e.target.value)}><option>Casamento</option><option>Casamento civil</option><option>Cerimônia</option><option>Uma celebração íntima</option><option>Bodas / renovação de votos</option><option>Ainda estamos decidindo</option></select></div><button onClick={() => document.querySelectorAll(".ns-moment-item select")[0]?.focus()}>Alterar</button></article>
        <article className="ns-moment-item"><span>🧭</span><div><small>Onde você mais precisa de ajuda</small><select value={data.moment.priority} onChange={(e) => setMoment("priority", e.target.value)}><option>Tenho medo de gastar demais</option><option>Não sei por onde começar</option><option>Preciso organizar convidados</option><option>Não sei escolher fornecedores</option><option>Quero dividir responsabilidades</option><option>Tenho muitas ideias e estou travada</option></select></div><button onClick={() => document.querySelector("select")?.focus()}>Alterar</button></article>
        <article className="ns-moment-item"><span>📍</span><div><small>Em que fase vocês estão</small><select value={data.moment.phase} onChange={(e) => setMoment("phase", e.target.value)}><option>Ainda é uma ideia</option><option>Já temos uma data</option><option>Estamos pesquisando</option><option>Já contratamos alguns serviços</option><option>Faltam poucos meses</option></select></div><button onClick={() => document.querySelectorAll("select")[1]?.focus()}>Alterar</button></article>
      </div>
      <div className="ns-confirm-note"><span>✓</span><div><strong>Entendi o momento de vocês.</strong><br />Agora vamos organizar o que vem primeiro.</div></div>
      <div className="ns-button-row"><button className="ns-button ns-button-quiet" onClick={() => go("inicio")}>Voltar</button><button className="ns-button ns-button-primary" onClick={enterApp}>Está certo, continuar <span>→</span></button></div>
    </section>
  </main>;

  const activeRoute = routes.find(([id]) => id === view);
  return <main className="ns-app">
    <header className="ns-top ns-app-top"><button className="ns-back" onClick={() => go("inicio")} aria-label="Ir para o início">←</button><a className="ns-brand" href="#inicio"><span className="ns-brand-mark">N</span><span>Noiva sem Surto</span></a><button className="ns-sos-top" onClick={() => go("sos")}>SOS</button></header>
    <div className="ns-layout">
      <aside className="ns-sidebar"><p className="ns-kicker">SEU ESPAÇO</p>{routes.map(([id, label, icon]) => <button key={id} className={`ns-nav-link ${view === id ? "selected" : ""} ${id === "sos" ? "sos-link" : ""}`} onClick={() => go(id)}><span>{icon}</span>{label}</button>)}<div className="ns-sidebar-note"><span>♡</span><p>Você não precisa resolver tudo hoje.</p></div></aside>
      <div className="ns-content">
        {!activeRoute && <>
          <section className="ns-advisor-card"><div className="ns-advisor-heading"><span>👩‍💼</span><div><p className="ns-kicker">SUA ASSESSORIA EM TEMPO REAL</p><small>ORIENTAÇÃO ATUALIZADA PELO QUE VOCÊ JÁ PREENCHEU</small></div></div><div className="ns-advisor-body"><div><span className="ns-advisor-label">O PRÓXIMO PASSO</span><h1>{advisor.title}</h1><p>{advisor.detail}</p></div><aside><span>POR QUE ISSO VEM AGORA</span><p>{advisor.reason}</p></aside></div><button type="button" className="ns-button ns-button-primary" onClick={() => advisor.view === "recursos" ? openResources(advisor.tab) : advisor.view === "evento" ? openEvent(advisor.tab) : go(advisor.view)}>{advisor.action} <span>→</span></button></section>
          <section className="ns-section-head"><div><p className="ns-kicker">ORGANIZE EM TRÊS FRENTES</p><h2>Uma decisão prepara a próxima</h2></div><button className="ns-link-button" onClick={() => go("momento")}>Atualizar meu momento ↗</button></section>
          <div className="ns-module-grid">{routes.map(([id, label, icon, description], index) => <button key={id} type="button" className={`ns-module-card ${id === "sos" ? "module-sos" : ""}`} onClick={() => id === "recursos" ? openResources() : id === "evento" ? openEvent() : go(id)}><span className="ns-module-order">{id === "sos" ? "AJUDA" : `ETAPA ${index + 1}`}</span><span className="ns-module-icon">{icon}</span><span className="ns-module-title">{label}</span><span className="ns-module-desc">{description}</span><span className="ns-module-arrow" aria-hidden="true">→</span></button>)}</div>
          
          <p className="ns-local-note">Seus dados ficam salvos no navegador deste aparelho. Para levar o planejamento a outro celular, use as opções de impressão/exportação ou mantenha este aparelho.</p>
        </>}

        {view === "recursos" && <>
          <PageHeading eyebrow="BASE DO PLANEJAMENTO" title="Orçamento e convidados" intro="Essas duas decisões caminham juntas: o número de pessoas muda o custo, e o orçamento ajuda a definir o que cabe." back={() => go("inicio")} />
          <div className="ns-view-tabs" role="tablist" aria-label="Orçamento e convidados">
            <button type="button" role="tab" aria-selected={resourceTab === "investimento"} className={resourceTab === "investimento" ? "selected" : ""} onClick={() => setResourceTab("investimento")}><span>💰</span><strong>Orçamento</strong><small>Limite, guardado e valores</small></button>
            <button type="button" role="tab" aria-selected={resourceTab === "convidados"} className={resourceTab === "convidados" ? "selected" : ""} onClick={() => setResourceTab("convidados")}><span>👥</span><strong>Convidados</strong><small>Lista, grupos e confirmação</small></button>
          </div>
          {resourceTab === "investimento" && <section className="ns-subview"><PageHeading eyebrow="INVESTIMENTO" title="Um plano que cabe na vida real" intro="Ajuste os valores quando quiser. As sugestões acompanham as escolhas que você faz." back={() => go("inicio")} />
          <div className="ns-card ns-budget-inputs"><MoneyField label="Até quanto vocês querem gastar?" value={budget.target} onChange={(v) => setBudget("target", v)} hint="O limite total que vocês gostariam de respeitar." /><MoneyField label="Quanto já está guardado?" value={budget.saved} onChange={(v) => setBudget("saved", v)} hint="Até R$ 100 já conta. Inclua o que já conseguiram separar." /><MoneyField label="Quanto conseguem juntar por mês?" value={budget.monthly} onChange={(v) => setBudget("monthly", v)} hint="Uma previsão mensal, mesmo que seja pequena." /></div>
          <div className="ns-section-head ns-budget-title"><div><p className="ns-kicker">VALOR SUGERIDO + VALOR REAL</p><h2>Distribua como fizer sentido</h2></div><span className="ns-soft-tag">Recalculado em tempo real</span></div>
          <div className="ns-budget-table"><div className="ns-budget-table-head"><span>Segmento</span><span>Sugestão</span><span>Real / orçamento</span><span /></div>{categories.map((item) => { const suggestion = Math.round(available * (Number(item.weight) || 0) / weightTotal); return <div className="ns-budget-row" key={item.id}><div><input className="ns-category-name" aria-label={`Nome do segmento ${item.name}`} value={item.name} onChange={(e) => updateCategory(item.id, { name: e.target.value })} /><small>Peso na distribuição</small></div><strong className="ns-suggested">{money(suggestion)}</strong><label className="ns-inline-money"><span>R$</span><input aria-label={`Valor real para ${item.name}`} inputMode="decimal" value={item.actual || ""} onChange={(e) => updateCategory(item.id, { actual: numberValue(e.target.value) })} placeholder="0" /></label><button className="ns-remove" onClick={() => removeCategory(item.id)} aria-label={`Remover ${item.name}`}>×</button></div>})}
            <form className="ns-add-row" onSubmit={(e) => { e.preventDefault(); addCategory(); }}><input aria-label="Novo segmento" placeholder="Adicionar outro segmento…" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} /><button type="submit" className="ns-button ns-button-small">+ Adicionar</button></form>
          </div>
          <div className="ns-budget-summary"><div><small>VALOR TOTAL DEFINIDO</small><strong>{money(target)}</strong></div><div><small>JÁ GUARDADO</small><strong>{money(saved)}</strong></div><div><small>AINDA PRECISA JUNTAR</small><strong>{money(Math.max(target - saved, 0))}</strong></div><div className={remaining < 0 ? "is-over" : "is-under"}><small>{remaining < 0 ? "ACIMA DO LIMITE" : "VALORES REAIS INFORMADOS"}</small><strong>{money(Math.abs(remaining))}</strong></div><p>{remaining < 0 ? `Os valores reais estão ${money(Math.abs(remaining))} acima do limite escolhido. Veja quais segmentos vocês querem rever.` : `Os valores informados estão ${money(remaining)} dentro do limite escolhido.`}{monthly > 0 && <> Com {money(monthly)} guardados por mês, falta cerca de {Math.ceil(Math.max(target - saved, 0) / monthly)} {Math.ceil(Math.max(target - saved, 0) / monthly) === 1 ? "mês" : "meses"} para chegar ao valor total.</>}</p></div>
          <button className="ns-button ns-button-quiet" onClick={() => go("inicio")}>← Voltar ao menu</button></section>}
          {resourceTab === "convidados" && <section className="ns-subview"><PageHeading eyebrow="LISTA DE CONVIDADOS" title="Cada nome conta uma história" intro="Organize as pessoas sem tomar decisões no impulso. Nenhum nome precisa desaparecer para vocês conseguirem enxergar a lista." back={() => go("inicio")} />
          <div className="ns-guest-summary"><label className="ns-guest-target"><span>🎯 Pessoas previstas</span><input type="number" min="0" value={data.guests.target} onChange={(e) => update((d) => ({ ...d, guests: { ...d.guests, target: Number(e.target.value) } }))} /></label><div><small>👥 NOMES ATIVOS</small><strong>{activeGuests.length}</strong></div><div><small>🗂️ GRUPOS</small><strong>{groupsCount.filter((item) => item.count).length}</strong></div><div><small>💗 ESSENCIAIS</small><strong>{activeGuests.filter((person) => person.importance === "Essencial").length}</strong></div><div><small>🧭 ACIMA DA PREVISÃO</small><strong className={guestGap > 0 ? "ns-alert-text" : "ns-good-text"}>{guestGap > 0 ? `+${guestGap}` : "Dentro do previsto"}</strong></div></div>
          <div className="ns-card ns-guest-add"><div><h2>Comece por onde for mais fácil</h2><p>Você pode colar uma lista pronta ou adicionar os nomes aos poucos.</p></div><label className="ns-field"><span>Grupo</span><select value={guestDraft.group} onChange={(e) => setGuestDraft({ ...guestDraft, group: e.target.value })}>{GROUPS.map((group) => <option key={group}>{group}</option>)}</select></label><div className="ns-add-guest-row"><input value={guestDraft.name} onChange={(e) => setGuestDraft({ ...guestDraft, name: e.target.value })} placeholder="Nome da pessoa" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGuest())} /><button className="ns-button ns-button-primary" onClick={() => addGuest()}>Adicionar pessoa</button></div><details className="ns-paste"><summary>Já tenho uma lista no bloco de notas</summary><textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder="Cole aqui os nomes, um por linha. Todos entrarão no grupo selecionado acima." rows={5} /><button className="ns-button ns-button-small" onClick={importGuests}>Adicionar nomes colados</button></details></div>
          <div className="ns-group-tabs">{groupsCount.map((item) => <span key={item.group}>👥 {item.group} <b>{item.count}</b></span>)}</div>
          <div className="ns-guest-steps" role="tablist" aria-label="Etapas da lista de convidados"><button type="button" role="tab" aria-selected={guestStage === "lista"} className={guestStage === "lista" ? "selected" : ""} onClick={() => setGuestStage("lista")}><span>1</span><strong>Organizar nomes</strong><small>{activeGuests.length} ativos</small></button><button type="button" role="tab" aria-selected={guestStage === "revisao"} className={guestStage === "revisao" ? "selected" : ""} onClick={() => setGuestStage("revisao")}><span>2</span><strong>Conferir essenciais</strong><small>{activeGuests.filter((person) => person.importance === "Essencial").length} essenciais</small></button></div>
          {guestStage === "revisao" && <div className="ns-inline-tip"><span>🌿</span> Agora olhem cada nome com calma: essa pessoa faz parte da vida de vocês hoje? A presença dela é importante para este momento? Não é preciso excluir ninguém no impulso.{!guestReviewComplete && <strong className="ns-review-reminder"> Para liberar a confirmação, classifiquem todos os nomes ativos como Essencial, Importante ou Pode rever.</strong>}</div>}
          <div className="ns-guest-list">{data.guests.people.length ? data.guests.people.map((person) => <article key={person.id} className={`ns-guest-row ${person.removed ? "guest-removed" : ""} ${guestStage === "revisao" ? "guest-review-row" : ""}`}><div className="ns-guest-name"><strong>{person.name}</strong><small>{person.group}{person.removed && person.reason ? ` · ${person.reason}` : ""}</small></div>{guestStage === "lista" ? <><select aria-label={`Grupo de ${person.name}`} value={person.group} onChange={(e) => updateGuest(person.id, { group: e.target.value })}>{GROUPS.map((group) => <option key={group}>{group}</option>)}</select><button type="button" className="ns-text-button" onClick={() => setGuestStage("revisao")}>Revisar importância</button></> : <><div className="ns-guest-review"><label><span>Importância para vocês</span><select aria-label={`Importância de ${person.name}`} value={person.importance || "Avaliar"} onChange={(e) => updateGuest(person.id, { importance: e.target.value })}><option>Avaliar</option><option>Essencial</option><option>Importante</option><option>Pode rever</option></select></label>{person.importance === "Pode rever" && <label><span>O que vale conversar?</span><input aria-label={`Motivo para rever ${person.name}`} value={person.review || ""} onChange={(e) => updateGuest(person.id, { review: e.target.value })} placeholder="Ex.: conversar com o casal" /></label>}</div><button type="button" className="ns-text-button" onClick={() => toggleRemoved(person)}>{person.removed ? "↶ Recolocar" : "Manter ou retirar"}</button></>}</article>) : <div className="ns-empty"><span>👥</span><strong>Sua lista começa com uma pessoa.</strong><p>Adicione um nome ou cole sua lista pronta.</p></div>}</div>
          <div className="ns-first-tip"><span>✦</span><div><small>UMA FORMA GENTIL DE COMEÇAR</small><p>{bestFirstStep}</p></div></div>
          <button className="ns-print-button" onClick={() => window.print()}>Imprimir lista e grupos ↗</button>
          {(data.moment.date || data.moment.certain) ? <section className="ns-card ns-rsvp"><p className="ns-kicker">QUANDO A DATA ESTIVER CERTA</p><h2>Vamos começar a confirmar?</h2><p>Monte o convite com um atalho de resposta. Ao tocar nele, cada convidado envia a confirmação para o WhatsApp da noiva.</p><label className="ns-rsvp-check"><input type="checkbox" disabled={!guestReviewComplete} checked={Boolean(data.guests.reviewed)} onChange={(e) => update((d) => ({ ...d, guests: { ...d.guests, reviewed: e.target.checked } }))} /><span><strong>Conferi a lista antes de confirmar</strong><small>Revisei nomes, grupos, acompanhantes e a importância de cada convite.</small></span></label><div className="ns-rsvp-fields"><Field label="Nome do casal" value={brideName} onChange={(e) => updateRsvp("brideName", e.target.value)} placeholder="Ex.: Ana e Luiza" /><Field label="WhatsApp da noiva (com DDI e DDD)" value={bridePhone} onChange={(e) => updateRsvp("bridePhone", e.target.value)} placeholder="5511999999999" /><Field label="Data do evento" type="date" value={data.moment.date} onChange={(e) => setMoment("date", e.target.value)} /><Field label="Local" value={data.celebration.location || ""} onChange={(e) => update((d) => ({ ...d, celebration: { ...d.celebration, location: e.target.value } }))} placeholder="Nome e endereço do local" /></div><div className="ns-rsvp-actions"><button type="button" className="ns-button ns-button-quiet" disabled={!data.guests.reviewed} onClick={copyRsvp}>📋 Copiar convite</button><a className={`ns-button ns-button-primary ${!rsvpUrl() || !data.guests.reviewed ? "is-disabled" : ""}`} href={rsvpUrl() && data.guests.reviewed ? rsvpUrl() : undefined} target="_blank" rel="noreferrer" aria-disabled={!rsvpUrl() || !data.guests.reviewed}>💬 Enviar convite pelo WhatsApp <span>↗</span></a></div><small className="ns-rsvp-note">{!data.guests.reviewed ? "Marque a conferência acima para liberar o envio dos convites. " : ""}O WhatsApp abre a lista de contatos com o convite pronto. A resposta de cada convidado abre uma conversa com a noiva. Ela precisa revisar e enviar as mensagens no WhatsApp; para importar respostas automaticamente de volta ao app, será necessária uma integração oficial do WhatsApp Business com servidor seguro.</small></section> : <div className="ns-rsvp-locked"><span>🔒</span><div><strong>A confirmação entra quando houver data ou certeza do evento.</strong><p>Assim a lista continua sendo um espaço para pensar, sem pressão para confirmar antes da hora.</p></div><button className="ns-text-button" onClick={() => update((d) => ({ ...d, moment: { ...d.moment, certain: !d.moment.certain } }))}>{data.moment.certain ? "Desmarcar" : "Já temos certeza"}</button></div>}</section>}
        </>}

        {view === "evento" && <>
          <PageHeading eyebrow="FORMATO E ORGANIZAÇÃO" title="Como esse momento vai acontecer" intro="Escolha o formato que faz sentido para vocês e organize os fornecedores e responsabilidades que tornam esse plano possível." back={() => go("inicio")} />
          <div className="ns-view-tabs" role="tablist" aria-label="Formato e fornecedores">
            <button type="button" role="tab" aria-selected={eventTab === "formato"} className={eventTab === "formato" ? "selected" : ""} onClick={() => setEventTab("formato")}><span>🥂</span><strong>Formato</strong><small>O jeito de vocês celebrarem</small></button>
            <button type="button" role="tab" aria-selected={eventTab === "fornecedores"} className={eventTab === "fornecedores" ? "selected" : ""} onClick={() => setEventTab("fornecedores")}><span>🤝</span><strong>Fornecedores</strong><small>Serviços e responsáveis</small></button>
          </div>
          {eventTab === "formato" && <section className="ns-subview"><PageHeading eyebrow="FORMATO DO MOMENTO" title="O que combina com vocês?" intro="Pode ser uma festa, um encontro íntimo, uma cerimônia ou só um jeito especial de marcar a data. O planejamento parte do significado, não de um formato obrigatório." back={() => go("inicio")} />
          <div className="ns-format-grid">{["Ainda estamos escolhendo", "Cerimônia e recepção", "Só cerimônia", "Encontro íntimo", "Casamento civil", "Bodas / renovação", "Sem festa por enquanto", "Outro formato"].map((format) => <button key={format} className={`ns-format-card ${data.celebration.format === format ? "chosen" : ""}`} onClick={() => update((d) => ({ ...d, celebration: { ...d.celebration, format } }))}><span>{data.celebration.format === format ? "✓" : "○"}</span><strong>{format}</strong></button>)}</div><div className="ns-card"><label className="ns-field"><span>O que é importante que esse momento tenha?</span><textarea rows={4} value={data.celebration.details} onChange={(e) => update((d) => ({ ...d, celebration: { ...d.celebration, details: e.target.value } }))} placeholder="Pessoas importantes, significado, limites, acessibilidade, uma refeição juntos…" /></label><p className="ns-inline-tip">✦ Não existe um único jeito certo de celebrar. O formato pode mudar conforme os planos de vocês.</p></div></section>}
          {eventTab === "fornecedores" && <section className="ns-subview"><PageHeading eyebrow="PLANEJAMENTO" title="Fornecedores e responsabilidades" intro="Guarde orçamentos, compare o que importa e divida as próximas ações entre vocês." back={() => go("inicio")} />
          <form className="ns-card ns-vendor-form" onSubmit={addVendor}><h2>Adicionar fornecedor</h2><div className="ns-vendor-fields"><Field label="Nome / empresa" value={vendorDraft.name} onChange={(e) => setVendorDraft({ ...vendorDraft, name: e.target.value })} placeholder="Ex.: Espaço Jardim" /><Field label="Categoria" value={vendorDraft.category} onChange={(e) => setVendorDraft({ ...vendorDraft, category: e.target.value })} placeholder="Ex.: Local, buffet, foto" /><Field label="Orçamento" inputMode="decimal" value={vendorDraft.value} onChange={(e) => setVendorDraft({ ...vendorDraft, value: e.target.value })} placeholder="R$" /><Field label="Responsável por acompanhar" value={vendorDraft.responsible} onChange={(e) => setVendorDraft({ ...vendorDraft, responsible: e.target.value })} placeholder="Nome" /></div><button className="ns-button ns-button-primary" type="submit">Guardar fornecedor +</button></form>
          <div className="ns-vendor-list">{data.vendors.length ? data.vendors.map((vendor) => <article className="ns-card ns-vendor-row" key={vendor.id}><div><small>{vendor.category || "Fornecedor"}</small><strong>{vendor.name}</strong><span>{vendor.responsible ? `Acompanhar: ${vendor.responsible}` : "Responsável ainda não definido"}</span></div><strong>{money(vendor.value)}</strong><select value={vendor.status} onChange={(e) => update((d) => ({ ...d, vendors: d.vendors.map((item) => item.id === vendor.id ? { ...item, status: e.target.value } : item) }))}><option>Pesquisar</option><option>Pedindo orçamento</option><option>Comparar</option><option>Escolhido</option><option>Contratado</option></select><button className="ns-remove" onClick={() => update((d) => ({ ...d, vendors: d.vendors.filter((item) => item.id !== vendor.id) }))}>×</button></article>) : <EmptyState title="Seus fornecedores aparecem aqui" text="Comece com quem já pesquisou ou recebeu orçamento." />}</div>
          <div className="ns-card ns-task-card"><h2>Quem pode cuidar do próximo passo?</h2><form className="ns-add-guest-row" onSubmit={addTask}><input value={taskDraft} onChange={(e) => setTaskDraft(e.target.value)} placeholder="Ex.: Pedir orçamento do espaço" /><button className="ns-button ns-button-primary">Adicionar responsabilidade</button></form>{data.tasks.map((task) => <label className="ns-task-row" key={task.id}><input type="checkbox" checked={task.done} onChange={() => update((d) => ({ ...d, tasks: d.tasks.map((item) => item.id === task.id ? { ...item, done: !item.done } : item) }))} /><span className={task.done ? "task-done" : ""}>{task.text}</span><button type="button" className="ns-remove" onClick={() => update((d) => ({ ...d, tasks: d.tasks.filter((item) => item.id !== task.id) }))}>×</button></label>)}</div></section>}
        </>}

        {view === "rota" && <>
          <PageHeading eyebrow="ROTA SEM SURTO" title="Seu próximo passo, sem a lista infinita" intro="Uma lista para imprimir, adaptar e continuar. Ela considera o momento e as prioridades que você marcou." back={() => go("inicio")} />
          <div className="ns-route-priority"><span>🧭</span><div><small>O FOCO DE AGORA</small><strong>{data.moment.priority}</strong><p>{data.moment.phase} · {data.moment.event}</p></div><button className="ns-text-button" onClick={() => go("momento")}>Ajustar</button></div>
          <div className="ns-route-list">{makeRoute(data).map((item, index) => <label className="ns-route-item" key={item}><input type="checkbox" checked={data.tasks.some((task) => task.text === item && task.done)} onChange={(e) => update((d) => { const found = d.tasks.find((task) => task.text === item); return { ...d, tasks: found ? d.tasks.map((task) => task.id === found.id ? { ...task, done: e.target.checked } : task) : [...d.tasks, { id: makeId(), text: item, done: e.target.checked }] }; })} /><span className="ns-route-number">{String(index + 1).padStart(2, "0")}</span><span>{item}</span></label>)}</div>
          <div className="ns-route-footer"><button type="button" className="ns-button ns-button-primary" onClick={() => window.print()}>🖨️ Imprimir rota e resumo</button><button type="button" className="ns-button ns-button-quiet" onClick={copyPlannerSummary}>📋 Copiar resumo</button><a className="ns-button ns-button-quiet" href={plannerWhatsAppUrl()} target="_blank" rel="noreferrer">💬 Compartilhar no WhatsApp ↗</a></div>
          <section className="ns-overview-section"><p className="ns-kicker">VISÃO GERAL · TUDO O QUE JÁ FOI ORGANIZADO</p><PageHeading eyebrow="VISÃO GERAL" title="Seu planejamento, reunido" intro="Tudo o que vocês organizaram até aqui, pronto para revisar, imprimir ou compartilhar." back={() => go("inicio")} />
          <div className="ns-overview-grid"><article className="ns-card"><span>🧭</span><small>SEU MOMENTO</small><strong>{data.moment.event}</strong><p>{data.moment.phase} · prioridade: {data.moment.priority}</p></article><article className="ns-card"><span>💰</span><small>INVESTIMENTO</small><strong>{money(target)}</strong><p>{money(saved)} guardados · {money(totalActual)} em valores informados</p></article><article className="ns-card"><span>👥</span><small>CONVIDADOS</small><strong>{activeGuests.length} / {data.guests.target}</strong><p>{activeGuests.filter((person) => person.importance === "Essencial").length} essenciais · {groupsCount.filter((item) => item.count).length} grupos</p></article><article className="ns-card"><span>🤝</span><small>FORNECEDORES</small><strong>{data.vendors.length} registrados</strong><p>{data.vendors.filter((vendor) => vendor.status === "Contratado").length} contratados</p></article><article className="ns-card"><span>🥂</span><small>FORMATO</small><strong>{data.celebration.format}</strong><p>{data.celebration.location || "Local ainda não definido"}</p></article><article className="ns-card"><span>✅</span><small>PRÓXIMAS AÇÕES</small><strong>{data.tasks.filter((task) => !task.done).length} pendentes</strong><p>{data.tasks.filter((task) => task.done).length} concluídas</p></article></div>
          <section className="ns-overview-details"><article className="ns-card"><h2>💰 Investimento por segmento</h2>{categories.length ? categories.map((item) => <p key={item.id}><strong>{item.name}</strong><span>Sugestão: {money(Math.round(available * (Number(item.weight) || 0) / weightTotal))} · Real: {money(item.actual)}</span></p>) : <p>Nenhum segmento cadastrado.</p>}</article><article className="ns-card"><h2>👥 Lista por grupo</h2>{groupsCount.map((item) => <p key={item.group}><strong>{item.group}</strong><span>{item.count} pessoas</span></p>)}</article><article className="ns-card"><h2>🤝 Fornecedores</h2>{data.vendors.length ? data.vendors.map((vendor) => <p key={vendor.id}><strong>{vendor.name}</strong><span>{vendor.category || "Fornecedor"} · {vendor.status} · {money(vendor.value)}</span></p>) : <p>Nenhum fornecedor registrado ainda.</p>}</article><article className="ns-card"><h2>✅ Ações e responsabilidades</h2>{data.tasks.length ? data.tasks.map((task) => <p key={task.id}><strong className={task.done ? "task-done" : ""}>{task.done ? "✓ " : "○ "}{task.text}</strong></p>) : <p>Nenhuma ação registrada ainda.</p>}</article></section>
          <div className="ns-overview-actions"><button type="button" className="ns-button ns-button-quiet" onClick={() => window.print()}>🖨️ Imprimir meu planejamento</button><button type="button" className="ns-button ns-button-quiet" onClick={copyPlannerSummary}>{copied ? "Resumo copiado ✓" : "📋 Copiar resumo"}</button><a className="ns-button ns-button-primary" href={plannerWhatsAppUrl()} target="_blank" rel="noreferrer">💬 Compartilhar no WhatsApp ↗</a></div>
          <p className="ns-local-note">O resumo inclui o que está salvo neste aparelho. Imprimir cria um arquivo que você pode guardar ou enviar.</p></section>
        </>}
        {view === "sos" && <>
          <PageHeading eyebrow="SOS · PARA O IMPREVISTO" title="Respira. Vamos cuidar do que aconteceu." intro="Escolha o que está pegando agora. Primeiro a gente reduz a urgência; depois organiza o próximo movimento." back={() => go("inicio")} />
          <div className="ns-sos-grid">{[["Mudaram o preço ou as condições", "Peça a informação por escrito e compare com o que foi combinado. Não confirme nada sob pressão; combine um prazo para responder."], ["Alguém cancelou ou não responde", "Confirme os fatos por mensagem, guarde contrato e comprovantes, e pergunte quais alternativas estão disponíveis."], ["Surgiu um gasto que não estava previsto", "Anote valor, prazo e o que ele substitui. Veja o impacto no limite antes de aceitar; um extra precisa caber em algum lugar."], ["Uma conversa ficou tensa", "Façam uma pausa curta. Retomem com uma pergunta por vez: ‘o que é mais importante para cada um agora?’"], ["A lista de convidados aumentou", "Registre os nomes primeiro. Conversem sobre capacidade e custo depois, sem apagar ninguém no calor do momento."], ["Aconteceu outra coisa", "Escreva o que aconteceu, o que precisa ser decidido hoje e o que pode esperar até amanhã."]].map(([title, text]) => <article className="ns-sos-card" key={title}><span>✦</span><strong>{title}</strong><p>{text}</p></article>)}</div><div className="ns-sos-reminder">Se houver risco à segurança, conflito com ameaça ou urgência médica, procure ajuda local imediata.</div>
        </>}
      </div>
    </div>
    <nav className="ns-bottom-nav" aria-label="Atalhos do planejamento">{[["inicio", "🏠", "Início"], ["recursos", "💰", "Base"], ["evento", "🥂", "Evento"], ["rota", "🧭", "Rota"], ["sos", "🆘", "SOS"]].map(([id, icon, label]) => <button type="button" key={id} className={view === id || (id === "recursos" && view === "recursos") || (id === "evento" && view === "evento") ? "active" : ""} onClick={() => id === "recursos" ? openResources() : id === "evento" ? openEvent() : go(id)}><span>{icon}</span><small>{label}</small></button>)}</nav>
    <footer className="ns-footer">Noiva sem Surto · Um passo de cada vez <span>Salvo neste aparelho</span></footer>
  </main>;
}

function PageHeading({ eyebrow, title, intro, back }) { return <div className="ns-page-heading"><button className="ns-back-inline" onClick={back}>← Menu</button><p className="ns-kicker">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div>; }
function EmptyState({ title, text }) { return <div className="ns-empty"><span>♡</span><strong>{title}</strong><p>{text}</p></div>; }
function makeRoute(data) {
  const priority = data.moment.priority || "Não sei por onde começar";
  const base = priority.includes("gastar") ? ["Definir o limite total que vocês querem respeitar.", "Registrar o que já está guardado e quanto conseguem juntar por mês.", "Estimar a quantidade de pessoas antes de comparar espaços e buffet."] : priority.includes("convidados") ? ["Combinar uma quantidade inicial de pessoas.", "Organizar nomes por família da noiva, família do noivo, amigos e trabalho.", "Olhar quais escolhas de formato e orçamento dependem da quantidade."] : priority.includes("fornecedor") ? ["Definir o que precisa ser contratado primeiro.", "Comparar propostas com os mesmos critérios e valores.", "Escolher quem acompanha cada conversa e próximo prazo."] : priority.includes("responsabilidades") ? ["Escolher uma decisão para dividir em casal.", "Anotar quem pesquisa, quem decide e quando retomam o assunto.", "Revisar o que pode esperar para não acumular tudo em você."] : ["Escolher o formato do momento que combina com vocês.", "Estimar valor possível e quantidade de pessoas.", "Marcar uma próxima conversa curta para escolher o passo seguinte."];
  if (data.moment.phase === "Faltam poucos meses") return [base[0], "Confirmar os serviços e prazos indispensáveis para a data.", "Simplificar os detalhes que ainda não são essenciais."];
  return base;
}
