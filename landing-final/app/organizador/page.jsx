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
  const groupsCount = GROUPS.map((group) => ({ group, count: activeGuests.filter((person) => person.group === group).length }));
  const guestGap = activeGuests.length - (Number(data.guests.target) || 0);
  const bestFirstStep = useMemo(() => {
    const largest = [...groupsCount].sort((a, b) => b.count - a.count)[0];
    if (guestGap <= 0) return "A lista está dentro da quantidade prevista. Você pode revisar os nomes com calma.";
    return `Comece conversando sobre o grupo “${largest?.group || "Amigos"}”, que hoje tem mais nomes. A lista continua inteira enquanto vocês decidem.`;
  }, [groupsCount, guestGap]);

  function update(updater) { setData((current) => typeof updater === "function" ? updater(current) : ({ ...current, ...updater })); }
  function setMoment(key, value) { update((current) => ({ ...current, moment: { ...current.moment, [key]: value } })); }
  function setBudget(key, value) { update((current) => ({ ...current, budget: { ...current.budget, [key]: value } })); }
  function updateRsvp(key, value) { if (key === "brideName") setBrideName(value); else setBridePhone(value); update((current) => ({ ...current, rsvp: { ...current.rsvp, [key]: value } })); }
  function go(next) { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function enterApp() { update((current) => ({ ...current, started: true })); go("inicio"); }

  function addGuest(name = guestDraft.name, group = guestDraft.group) {
    const clean = name.trim(); if (!clean) return;
    update((current) => ({ ...current, guests: { ...current.guests, people: [...current.guests.people, { id: makeId(), name: clean, group, removed: false, reason: "" }] } }));
    setGuestDraft({ ...guestDraft, name: "" });
  }
  function importGuests() {
    const names = pasteText.split(/\n|,|;/).map((name) => name.trim()).filter(Boolean);
    if (!names.length) return;
    update((current) => ({ ...current, guests: { ...current.guests, people: [...current.guests.people, ...names.map((name) => ({ id: makeId(), name, group: guestDraft.group, removed: false, reason: "" }))] } }));
    setPasteText("");
  }
  function updateGuest(id, patch) { update((current) => ({ ...current, guests: { ...current.guests, people: current.guests.people.map((person) => person.id === id ? { ...person, ...patch } : person) } })); }
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
  function rsvpUrl() { return rsvpReplyUrl() ? `https://wa.me/?text=${encodeURIComponent(rsvpText())}` : ""; }
  async function copyRsvp() { try { await navigator.clipboard.writeText(rsvpText()); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt("Copie o texto do convite:", rsvpText()); } }

  const routes = [
    ["bussola", "Bússola", "🧭", "Encontre a decisão que vem primeiro"],
    ["investimento", "Investimento", "💸", "Orçamento, valores e previsões"],
    ["convidados", "Lista de convidados", "👥", "Organize sem apagar ninguém"],
    ["planejamento", "Planejamento", "🤝", "Fornecedores e responsabilidades"],
    ["celebracao", "Formato do momento", "🥂", "Uma celebração do jeito de vocês"],
    ["rota", "Rota Sem Surto", "✅", "Uma lista possível, no seu ritmo"],
    ["sos", "SOS", "🆘", "Ajuda para quando algo sair do plano"],
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
      <button className="ns-button ns-button-primary" onClick={() => go("momento")}>Começar minha rota <span>→</span></button>
      <p className="ns-footnote">Sem pressa. Suas escolhas ficam salvas neste aparelho.</p>
    </section>
  </main>;

  if (view === "momento") return <main className="ns-app ns-onboarding"><header className="ns-top"><button className="ns-back" onClick={() => go("inicio")}>← <span>Voltar</span></button><span className="ns-step">SEU MOMENTO · 1 DE 1</span></header>
    <section className="ns-moment"><p className="ns-kicker">BÚSSOLA SEM SURTO</p><h1>Meu momento atual</h1><p className="ns-lead">É assim que vocês estão hoje? Isso ajuda a organizar as próximas decisões.</p>
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
          <section className="ns-dashboard-hero"><div><p className="ns-kicker">SUA BÚSSOLA ESTÁ AQUI</p><h1>Oi, noiva.<br /><em>Vamos por partes.</em></h1><p>{data.moment.priority === "Tenho medo de gastar demais" ? "Você não precisa fechar todos os números agora. Vamos começar encontrando um limite que faça sentido." : "Seu planejamento começa pelo que é importante para vocês. A gente organiza o restante no caminho."}</p><button className="ns-button ns-button-primary" onClick={() => go("bussola")}>Abrir minha bússola <span>→</span></button></div><div className="ns-hero-stamp"><span>✦</span><strong>um passo<br />por vez</strong></div></section>
          <section className="ns-section-head"><div><p className="ns-kicker">ESCOLHA O QUE PRECISA AGORA</p><h2>Seu planejamento, no seu ritmo</h2></div><button className="ns-link-button" onClick={() => go("momento")}>Meu momento atual ↗</button></section>
          <div className="ns-module-grid">{routes.map(([id, label, icon, description]) => <button key={id} className={`ns-module-card ${id === "sos" ? "module-sos" : ""}`} onClick={() => go(id)}><span className="ns-module-icon">{icon}</span><span className="ns-module-title">{label}</span><span className="ns-module-desc">{description}</span><span className="ns-module-arrow">→</span></button>)}</div>
          <section className="ns-next-card"><span>PRÓXIMO PASSO SUGERIDO</span><div><strong>{data.moment.priority === "Tenho medo de gastar demais" ? "Comece pelo investimento" : "Comece pela Bússola"}</strong><p>As decisões básicas dão clareza para todo o resto.</p></div><button onClick={() => go(data.moment.priority === "Tenho medo de gastar demais" ? "investimento" : "bussola")}>Continuar →</button></section>
          <p className="ns-local-note">Seus dados ficam salvos no navegador deste aparelho. Para levar o planejamento a outro celular, use as opções de impressão/exportação ou mantenha este aparelho.</p>
        </>}

        {view === "bussola" && <>
          <PageHeading eyebrow="BÚSSOLA SEM SURTO" title="O que precisa vir primeiro?" intro="Quatro respostas simples ajudam a encontrar o próximo passo sem tentar planejar o casamento inteiro hoje." back={() => go("inicio")} />
          <div className="ns-card ns-compass-card"><div className="ns-compass-question"><span>01</span><div><strong>O que vocês querem celebrar?</strong><p>O formato pode mudar ao longo do caminho.</p></div><select value={data.moment.event} onChange={(e) => setMoment("event", e.target.value)}><option>Casamento</option><option>Casamento civil</option><option>Cerimônia</option><option>Uma celebração íntima</option><option>Bodas / renovação de votos</option><option>Ainda estamos decidindo</option></select></div>
            <div className="ns-compass-question"><span>02</span><div><strong>Qual valor parece possível para vocês?</strong><p>Uma estimativa inicial já ajuda. Você pode ajustar depois.</p></div><div className="ns-money"><span>R$</span><input inputMode="decimal" value={target || ""} onChange={(e) => setBudget("target", numberValue(e.target.value))} placeholder="Ainda não sei" /></div></div>
            <div className="ns-compass-question"><span>03</span><div><strong>Quantas pessoas vocês imaginam?</strong><p>A lista é um norte, não uma promessa final.</p></div><input className="ns-small-input" type="number" min="0" value={data.guests.target} onChange={(e) => update((d) => ({ ...d, guests: { ...d.guests, target: Number(e.target.value) } }))} /></div>
            <div className="ns-compass-question"><span>04</span><div><strong>O que está mais urgente para você?</strong><p>A rota muda conforme o que pesa agora.</p></div><select value={data.moment.priority} onChange={(e) => setMoment("priority", e.target.value)}><option>Tenho medo de gastar demais</option><option>Não sei por onde começar</option><option>Preciso organizar convidados</option><option>Não sei escolher fornecedores</option><option>Quero dividir responsabilidades</option><option>Tenho muitas ideias e estou travada</option></select></div>
            <div className="ns-compass-question"><span>05</span><div><strong>Já existe uma data?</strong><p>Se ainda não existe, pode deixar em branco.</p></div><input className="ns-small-input" type="date" value={data.moment.date} onChange={(e) => setMoment("date", e.target.value)} /></div>
            <div className="ns-inline-tip"><span>✦</span> Você pode voltar aqui sempre que seus planos mudarem.</div>
          </div>
          <button className="ns-button ns-button-primary" onClick={() => go("rota")}>Ver meu próximo passo <span>→</span></button>
        </>}

        {view === "investimento" && <>
          <PageHeading eyebrow="INVESTIMENTO" title="Um plano que cabe na vida real" intro="Ajuste os valores quando quiser. As sugestões acompanham as escolhas que você faz." back={() => go("inicio")} />
          <div className="ns-card ns-budget-inputs"><MoneyField label="Até quanto vocês querem gastar?" value={budget.target} onChange={(v) => setBudget("target", v)} hint="O limite total que vocês gostariam de respeitar." /><MoneyField label="Quanto já está guardado?" value={budget.saved} onChange={(v) => setBudget("saved", v)} hint="Até R$ 100 já conta. Inclua o que já conseguiram separar." /><MoneyField label="Quanto conseguem juntar por mês?" value={budget.monthly} onChange={(v) => setBudget("monthly", v)} hint="Uma previsão mensal, mesmo que seja pequena." /></div>
          <div className="ns-section-head ns-budget-title"><div><p className="ns-kicker">VALOR SUGERIDO + VALOR REAL</p><h2>Distribua como fizer sentido</h2></div><span className="ns-soft-tag">Recalculado em tempo real</span></div>
          <div className="ns-budget-table"><div className="ns-budget-table-head"><span>Segmento</span><span>Sugestão</span><span>Real / orçamento</span><span /></div>{categories.map((item) => { const suggestion = Math.round(available * (Number(item.weight) || 0) / weightTotal); return <div className="ns-budget-row" key={item.id}><div><input className="ns-category-name" aria-label={`Nome do segmento ${item.name}`} value={item.name} onChange={(e) => updateCategory(item.id, { name: e.target.value })} /><small>Peso na distribuição</small></div><strong className="ns-suggested">{money(suggestion)}</strong><label className="ns-inline-money"><span>R$</span><input aria-label={`Valor real para ${item.name}`} inputMode="decimal" value={item.actual || ""} onChange={(e) => updateCategory(item.id, { actual: numberValue(e.target.value) })} placeholder="0" /></label><button className="ns-remove" onClick={() => removeCategory(item.id)} aria-label={`Remover ${item.name}`}>×</button></div>})}
            <form className="ns-add-row" onSubmit={(e) => { e.preventDefault(); addCategory(); }}><input aria-label="Novo segmento" placeholder="Adicionar outro segmento…" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} /><button type="submit" className="ns-button ns-button-small">+ Adicionar</button></form>
          </div>
          <div className="ns-budget-summary"><div><small>VALOR TOTAL DEFINIDO</small><strong>{money(target)}</strong></div><div><small>JÁ GUARDADO</small><strong>{money(saved)}</strong></div><div><small>AINDA PRECISA JUNTAR</small><strong>{money(Math.max(target - saved, 0))}</strong></div><div className={remaining < 0 ? "is-over" : "is-under"}><small>{remaining < 0 ? "ACIMA DO LIMITE" : "VALORES REAIS INFORMADOS"}</small><strong>{money(Math.abs(remaining))}</strong></div><p>{remaining < 0 ? `Os valores reais estão ${money(Math.abs(remaining))} acima do limite escolhido. Veja quais segmentos vocês querem rever.` : `Os valores informados estão ${money(remaining)} dentro do limite escolhido.`}{monthly > 0 && <> Com {money(monthly)} guardados por mês, falta cerca de {Math.ceil(Math.max(target - saved, 0) / monthly)} {Math.ceil(Math.max(target - saved, 0) / monthly) === 1 ? "mês" : "meses"} para chegar ao valor total.</>}</p></div>
          <button className="ns-button ns-button-quiet" onClick={() => go("inicio")}>← Voltar ao menu</button>
        </>}

        {view === "convidados" && <>
          <PageHeading eyebrow="LISTA DE CONVIDADOS" title="Cada nome conta uma história" intro="Organize as pessoas sem tomar decisões no impulso. Nenhum nome precisa desaparecer para vocês conseguirem enxergar a lista." back={() => go("inicio")} />
          <div className="ns-guest-summary"><label className="ns-guest-target"><span>Quantidade prevista</span><input type="number" min="0" value={data.guests.target} onChange={(e) => update((d) => ({ ...d, guests: { ...d.guests, target: Number(e.target.value) } }))} /></label><div><small>NA LISTA ATIVA</small><strong>{activeGuests.length}</strong></div><div><small>GRUPOS ORGANIZADOS</small><strong>{groupsCount.filter((item) => item.count).length}</strong></div><div><small>PRECISA AJUSTAR?</small><strong className={guestGap > 0 ? "ns-alert-text" : "ns-good-text"}>{guestGap > 0 ? `+${guestGap}` : "Por enquanto, não"}</strong></div></div>
          <div className="ns-card ns-guest-add"><div><h2>Comece por onde for mais fácil</h2><p>Você pode colar uma lista pronta ou adicionar os nomes aos poucos.</p></div><label className="ns-field"><span>Grupo</span><select value={guestDraft.group} onChange={(e) => setGuestDraft({ ...guestDraft, group: e.target.value })}>{GROUPS.map((group) => <option key={group}>{group}</option>)}</select></label><div className="ns-add-guest-row"><input value={guestDraft.name} onChange={(e) => setGuestDraft({ ...guestDraft, name: e.target.value })} placeholder="Nome da pessoa" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGuest())} /><button className="ns-button ns-button-primary" onClick={() => addGuest()}>Adicionar pessoa</button></div><details className="ns-paste"><summary>Já tenho uma lista no bloco de notas</summary><textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder="Cole aqui os nomes, um por linha. Todos entrarão no grupo selecionado acima." rows={5} /><button className="ns-button ns-button-small" onClick={importGuests}>Adicionar nomes colados</button></details></div>
          <div className="ns-group-tabs">{groupsCount.map((item) => <span key={item.group}>{item.group} <b>{item.count}</b></span>)}</div>
          <div className="ns-guest-list">{data.guests.people.length ? data.guests.people.map((person) => <article key={person.id} className={`ns-guest-row ${person.removed ? "guest-removed" : ""}`}><div className="ns-guest-name"><strong>{person.name}</strong><small>{person.group}{person.removed && person.reason ? ` · ${person.reason}` : ""}</small></div><select aria-label={`Grupo de ${person.name}`} value={person.group} onChange={(e) => updateGuest(person.id, { group: e.target.value })}>{GROUPS.map((group) => <option key={group}>{group}</option>)}</select><button className="ns-text-button" onClick={() => toggleRemoved(person)}>{person.removed ? "↶ Recolocar" : "Rever nome"}</button></article>) : <div className="ns-empty"><span>♡</span><strong>Sua lista começa com uma pessoa.</strong><p>Adicione o primeiro nome ou cole uma lista que já montou.</p></div>}</div>
          <div className="ns-first-tip"><span>✦</span><div><small>UMA FORMA GENTIL DE COMEÇAR</small><p>{bestFirstStep}</p></div></div>
          <button className="ns-print-button" onClick={() => window.print()}>Imprimir lista e grupos ↗</button>
          {(data.moment.date || data.moment.certain) ? <section className="ns-card ns-rsvp"><p className="ns-kicker">QUANDO A DATA ESTIVER CERTA</p><h2>Vamos começar a confirmar?</h2><p>Monte o convite com um atalho de resposta. Ao tocar nele, cada convidado envia a confirmação para o WhatsApp da noiva.</p><div className="ns-rsvp-fields"><Field label="Nome do casal" value={brideName} onChange={(e) => updateRsvp("brideName", e.target.value)} placeholder="Ex.: Ana e Luiza" /><Field label="WhatsApp da noiva (com DDI e DDD)" value={bridePhone} onChange={(e) => updateRsvp("bridePhone", e.target.value)} placeholder="5511999999999" /><Field label="Data do evento" type="date" value={data.moment.date} onChange={(e) => setMoment("date", e.target.value)} /><Field label="Local" value={data.celebration.location || ""} onChange={(e) => update((d) => ({ ...d, celebration: { ...d.celebration, location: e.target.value } }))} placeholder="Nome e endereço do local" /></div><div className="ns-rsvp-actions"><button className="ns-button ns-button-quiet" onClick={copyRsvp}>{copied ? "Convite copiado ✓" : "Copiar texto do convite"}</button><a className={`ns-button ns-button-primary ${!rsvpUrl() ? "is-disabled" : ""}`} href={rsvpUrl() || undefined} target="_blank" rel="noreferrer">Enviar convite pelo WhatsApp <span>↗</span></a></div><small className="ns-rsvp-note">O WhatsApp abre a lista de contatos com o convite pronto. A resposta de cada convidado abre uma conversa com a noiva. Ela precisa revisar e enviar as mensagens no WhatsApp; para importar respostas automaticamente de volta ao app, será necessária uma integração oficial do WhatsApp Business com servidor seguro.</small></section> : <div className="ns-rsvp-locked"><span>🔒</span><div><strong>A confirmação entra quando houver data ou certeza do evento.</strong><p>Assim a lista continua sendo um espaço para pensar, sem pressão para confirmar antes da hora.</p></div><button className="ns-text-button" onClick={() => update((d) => ({ ...d, moment: { ...d.moment, certain: !d.moment.certain } }))}>{data.moment.certain ? "Desmarcar" : "Já temos certeza"}</button></div>}
        </>}

        {view === "planejamento" && <>
          <PageHeading eyebrow="PLANEJAMENTO" title="Fornecedores e responsabilidades" intro="Guarde orçamentos, compare o que importa e divida as próximas ações entre vocês." back={() => go("inicio")} />
          <form className="ns-card ns-vendor-form" onSubmit={addVendor}><h2>Adicionar fornecedor</h2><div className="ns-vendor-fields"><Field label="Nome / empresa" value={vendorDraft.name} onChange={(e) => setVendorDraft({ ...vendorDraft, name: e.target.value })} placeholder="Ex.: Espaço Jardim" /><Field label="Categoria" value={vendorDraft.category} onChange={(e) => setVendorDraft({ ...vendorDraft, category: e.target.value })} placeholder="Ex.: Local, buffet, foto" /><Field label="Orçamento" inputMode="decimal" value={vendorDraft.value} onChange={(e) => setVendorDraft({ ...vendorDraft, value: e.target.value })} placeholder="R$" /><Field label="Responsável por acompanhar" value={vendorDraft.responsible} onChange={(e) => setVendorDraft({ ...vendorDraft, responsible: e.target.value })} placeholder="Nome" /></div><button className="ns-button ns-button-primary" type="submit">Guardar fornecedor +</button></form>
          <div className="ns-vendor-list">{data.vendors.length ? data.vendors.map((vendor) => <article className="ns-card ns-vendor-row" key={vendor.id}><div><small>{vendor.category || "Fornecedor"}</small><strong>{vendor.name}</strong><span>{vendor.responsible ? `Acompanhar: ${vendor.responsible}` : "Responsável ainda não definido"}</span></div><strong>{money(vendor.value)}</strong><select value={vendor.status} onChange={(e) => update((d) => ({ ...d, vendors: d.vendors.map((item) => item.id === vendor.id ? { ...item, status: e.target.value } : item) }))}><option>Pesquisar</option><option>Pedindo orçamento</option><option>Comparar</option><option>Escolhido</option><option>Contratado</option></select><button className="ns-remove" onClick={() => update((d) => ({ ...d, vendors: d.vendors.filter((item) => item.id !== vendor.id) }))}>×</button></article>) : <EmptyState title="Seus fornecedores aparecem aqui" text="Comece com quem já pesquisou ou recebeu orçamento." />}</div>
          <div className="ns-card ns-task-card"><h2>Quem pode cuidar do próximo passo?</h2><form className="ns-add-guest-row" onSubmit={addTask}><input value={taskDraft} onChange={(e) => setTaskDraft(e.target.value)} placeholder="Ex.: Pedir orçamento do espaço" /><button className="ns-button ns-button-primary">Adicionar responsabilidade</button></form>{data.tasks.map((task) => <label className="ns-task-row" key={task.id}><input type="checkbox" checked={task.done} onChange={() => update((d) => ({ ...d, tasks: d.tasks.map((item) => item.id === task.id ? { ...item, done: !item.done } : item) }))} /><span className={task.done ? "task-done" : ""}>{task.text}</span><button type="button" className="ns-remove" onClick={() => update((d) => ({ ...d, tasks: d.tasks.filter((item) => item.id !== task.id) }))}>×</button></label>)}</div>
        </>}

        {view === "celebracao" && <>
          <PageHeading eyebrow="FORMATO DO MOMENTO" title="O que combina com vocês?" intro="Pode ser uma festa, um encontro íntimo, uma cerimônia ou só um jeito especial de marcar a data. O planejamento parte do significado, não de um formato obrigatório." back={() => go("inicio")} />
          <div className="ns-format-grid">{["Ainda estamos escolhendo", "Cerimônia e recepção", "Só cerimônia", "Encontro íntimo", "Casamento civil", "Bodas / renovação", "Sem festa por enquanto", "Outro formato"].map((format) => <button key={format} className={`ns-format-card ${data.celebration.format === format ? "chosen" : ""}`} onClick={() => update((d) => ({ ...d, celebration: { ...d.celebration, format } }))}><span>{data.celebration.format === format ? "✓" : "○"}</span><strong>{format}</strong></button>)}</div><div className="ns-card"><label className="ns-field"><span>O que é importante que esse momento tenha?</span><textarea rows={4} value={data.celebration.details} onChange={(e) => update((d) => ({ ...d, celebration: { ...d.celebration, details: e.target.value } }))} placeholder="Pessoas importantes, significado, limites, acessibilidade, uma refeição juntos…" /></label><p className="ns-inline-tip">✦ Não existe um único jeito certo de celebrar. O formato pode mudar conforme os planos de vocês.</p></div>
        </>}

        {view === "rota" && <>
          <PageHeading eyebrow="ROTA SEM SURTO" title="Seu próximo passo, sem a lista infinita" intro="Uma lista para imprimir, adaptar e continuar. Ela considera o momento e as prioridades que você marcou." back={() => go("inicio")} />
          <div className="ns-route-priority"><span>🧭</span><div><small>O FOCO DE AGORA</small><strong>{data.moment.priority}</strong><p>{data.moment.phase} · {data.moment.event}</p></div><button className="ns-text-button" onClick={() => go("momento")}>Ajustar</button></div>
          <div className="ns-route-list">{makeRoute(data).map((item, index) => <label className="ns-route-item" key={item}><input type="checkbox" checked={data.tasks.some((task) => task.text === item && task.done)} onChange={(e) => update((d) => { const found = d.tasks.find((task) => task.text === item); return { ...d, tasks: found ? d.tasks.map((task) => task.id === found.id ? { ...task, done: e.target.checked } : task) : [...d.tasks, { id: makeId(), text: item, done: e.target.checked }] }; })} /><span className="ns-route-number">{String(index + 1).padStart(2, "0")}</span><span>{item}</span></label>)}</div>
          <div className="ns-route-footer"><button className="ns-button ns-button-primary" onClick={() => window.print()}>Imprimir minha rota ↗</button><button className="ns-button ns-button-quiet" onClick={() => go("inicio")}>Voltar ao menu</button></div>
        </>}

        {view === "sos" && <>
          <PageHeading eyebrow="SOS · PARA O IMPREVISTO" title="Respira. Vamos cuidar do que aconteceu." intro="Escolha o que está pegando agora. Primeiro a gente reduz a urgência; depois organiza o próximo movimento." back={() => go("inicio")} />
          <div className="ns-sos-grid">{[["Mudaram o preço ou as condições", "Peça a informação por escrito e compare com o que foi combinado. Não confirme nada sob pressão; combine um prazo para responder."], ["Alguém cancelou ou não responde", "Confirme os fatos por mensagem, guarde contrato e comprovantes, e pergunte quais alternativas estão disponíveis."], ["Surgiu um gasto que não estava previsto", "Anote valor, prazo e o que ele substitui. Veja o impacto no limite antes de aceitar; um extra precisa caber em algum lugar."], ["Uma conversa ficou tensa", "Façam uma pausa curta. Retomem com uma pergunta por vez: ‘o que é mais importante para cada um agora?’"], ["A lista de convidados aumentou", "Registre os nomes primeiro. Conversem sobre capacidade e custo depois, sem apagar ninguém no calor do momento."], ["Aconteceu outra coisa", "Escreva o que aconteceu, o que precisa ser decidido hoje e o que pode esperar até amanhã."]].map(([title, text]) => <article className="ns-sos-card" key={title}><span>✦</span><strong>{title}</strong><p>{text}</p></article>)}</div><div className="ns-sos-reminder">Se houver risco à segurança, conflito com ameaça ou urgência médica, procure ajuda local imediata.</div>
        </>}
      </div>
    </div>
    <nav className="ns-bottom-nav" aria-label="Navegação principal">{[["inicio", "⌂", "Início"], ["bussola", "🧭", "Bússola"], ["investimento", "◉", "Valores"], ["convidados", "♧", "Pessoas"], ["sos", "!", "SOS"]].map(([id, icon, label]) => <button key={id} className={view === id ? "active" : ""} onClick={() => go(id)}><span>{icon}</span>{label}</button>)}</nav>
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
