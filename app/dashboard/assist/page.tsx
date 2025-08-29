"use client";

import React from "react";
import MarkdownViewer from "../_components/ui/MarkdownViewer";
import { useAssistBrief, useAssistChat } from "../_lib/hooks/assist";

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition
        ${active ? "bg-primary text-white dark:bg-white dark:text-black" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white"}`}
    >
      {children}
    </button>
  );
}

export default function NewsAnalysisPage() {
  const [tab, setTab] = React.useState<"brief" | "chat">("brief");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Analyse de l’actualité</h1>
        <div className="flex gap-2">
          <TabButton active={tab === "brief"} onClick={() => setTab("brief")}>Brief</TabButton>
          <TabButton active={tab === "chat"} onClick={() => setTab("chat")}>Chat</TabButton>
        </div>
      </header>

      {tab === "brief" ? <BriefPanel /> : <ChatPanel />}
    </div>
  );
}

/* --------------- BRIEF --------------- */
function BriefPanel() {
  const brief = useAssistBrief();

  // paramètres par défaut: 7 jours / 50 titres
  const [sinceHours, setSinceHours] = React.useState(168);
  const [limit, setLimit] = React.useState(50);
  const [risk, setRisk] = React.useState("prudent");
  const [lang, setLang] = React.useState("fr");

  const onRun = () => {
    brief.mutate({ since_hours: sinceHours, limit, risk_profile: risk, lang });
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Fenêtre (heures)</span>
          <input type="number" min={6} max={720} value={sinceHours}
                 onChange={(e) => setSinceHours(parseInt(e.target.value || "0"))}
                 className="border rounded-lg px-3 py-2 bg-transparent" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Nombre de titres</span>
          <input type="number" min={5} max={100} value={limit}
                 onChange={(e) => setLimit(parseInt(e.target.value || "0"))}
                 className="border rounded-lg px-3 py-2 bg-transparent" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Profil</span>
          <select value={risk} onChange={(e) => setRisk(e.target.value)}
                  className="border rounded-lg px-3 py-2 bg-transparent">
            <option value="prudent">Prudent</option>
            <option value="neutre">Neutre</option>
            <option value="dynamique">Dynamique</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Langue</span>
          <select value={lang} onChange={(e) => setLang(e.target.value)}
                  className="border rounded-lg px-3 py-2 bg-transparent">
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </label>
      </div>

      <div className="flex gap-2 bg-white rounded-2xl p-4">
        <button onClick={onRun}
                disabled={brief.isPending}
                className="px-4 py-2 rounded-lg bg-primary text-white dark:bg-white dark:text-black">
          {brief.isPending ? "Génération..." : "Générer le brief"}
        </button>
        {brief.isError && <span className="text-red-600 text-sm">Erreur: {(brief.error as any)?.message || "échec"}</span>}
      </div>

      <div className="min-h-[200px] border rounded-lg p-4 bg-white">
        {brief.isPending && <p className="text-sm text-zinc-500">Analyse en cours…</p>}
        {!brief.isPending && <MarkdownViewer markdown={brief.data?.markdown} />}
      </div>
    </div>
  );
}

/* --------------- CHAT --------------- */
type Msg = { role: "user" | "assistant"; content: string };

function ChatPanel() {
  const chat = useAssistChat();
  const [lang, setLang] = React.useState("fr");
  const [risk, setRisk] = React.useState("prudent");
  const [input, setInput] = React.useState("");
  const [thread, setThread] = React.useState<Msg[]>([]);

  const send = () => {
    const message = input.trim();
    if (!message) return;
    setThread((t) => [...t, { role: "user", content: message }]);
    setInput("");

    const history = thread.slice(-6).map((m) => `${m.role === "user" ? "Utilisateur" : "Assistant"}: ${m.content}`);
    chat.mutate(
      { message, history, lang, risk_profile: risk },
      {
        onSuccess: (res) => setThread((t) => [...t, { role: "assistant", content: res.markdown }]),
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Langue</span>
          <select value={lang} onChange={(e) => setLang(e.target.value)}
                  className="border rounded-lg px-3 py-2 bg-transparent">
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Profil</span>
          <select value={risk} onChange={(e) => setRisk(e.target.value)}
                  className="border rounded-lg px-3 py-2 bg-transparent">
            <option value="prudent">Prudent</option>
            <option value="neutre">Neutre</option>
            <option value="dynamique">Dynamique</option>
          </select>
        </label>
      </div>

      <div className="border rounded-lg p-4 space-y-4 h-124 bg-white overflow-y-scroll">
        {thread.length === 0 && (
          <p className="text-sm text-zinc-500">
            Pose une question (ex: “Donne-moi 3 points clés sur la semaine crypto”).
          </p>
        )}
        {thread.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            {m.role === "user" ? (
              <div className="inline-block rounded-2xl px-3 py-2 bg-zinc-100 dark:bg-zinc-800 max-w-[85%]">
                <span className="text-sm">{m.content}</span>
              </div>
            ) : (
              <div className="inline-block rounded-2xl px-3 py-2 border max-w-[85%]">
                <MarkdownViewer markdown={m.content} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 bg-white p-4 rounded-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écrire un message…"
          className="flex-1 border rounded-lg px-3 py-2 bg-transparent"
        />
        <button
          onClick={send}
          disabled={chat.isPending}
          className="px-4 py-2 rounded-lg bg-primary text-white dark:bg-white dark:text-black"
        >
          {chat.isPending ? "Envoi…" : "Envoyer"}
        </button>
      </div>

      {chat.isError && <p className="text-red-600 text-sm">Erreur: {(chat.error as any)?.message || "échec"}</p>}
    </div>
  );
}
