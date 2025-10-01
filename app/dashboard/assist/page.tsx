"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownViewer from "../_components/ui/MarkdownViewer";
import { useAssistBrief, useAssistChat } from "../_lib/hooks/assist";

/* ---------- UI atoms ---------- */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-md ${className}`}
    />
  );
}

function ToolStatus({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 text-xs px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-md">
      <span className="i-lucide-hammer w-4 h-4" />
      <span>{msg}</span>
    </div>
  );
}

/* ---------- Page ---------- */

export default function NewsAnalysisPage() {
  const [tab, setTab] = React.useState<"brief" | "chat">("brief");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Analyse de l’actualité</h1>
        <div className="flex gap-2">
          <TabButton active={tab === "brief"} onClick={() => setTab("brief")}>
            Brief
          </TabButton>
          <TabButton active={tab === "chat"} onClick={() => setTab("chat")}>
            Chat
          </TabButton>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {tab === "brief" ? (
          <motion.div
            key="brief"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <BriefPanel />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <ChatPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------- BRIEF --------------- */

function BriefPanel() {
  const brief = useAssistBrief();

  const [sinceHours, setSinceHours] = React.useState(168); // 7 jours
  const [limit, setLimit] = React.useState(50);
  const [risk, setRisk] = React.useState("prudent");
  const [lang, setLang] = React.useState("fr");

  const [toolMsg, setToolMsg] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const onRun = () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    // Message “outil en cours” (optionnel si ton API renvoie déjà l’info)
    setToolMsg("Appel aux outils MCP en cours…");

    brief.mutate(
      { since_hours: sinceHours, limit, risk_profile: risk, lang},
      {
        onSettled: () => setToolMsg(null),
      }
    );
  };

  const onStop = () => {
    abortRef.current?.abort();
    setToolMsg(null);
  };

  return (
    <div className="space-y-4">
      <motion.div
        layout
        className="grid sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl"
      >
        <Field label="Fenêtre (heures)">
          <input
            type="number"
            min={6}
            max={720}
            value={sinceHours}
            onChange={(e) => setSinceHours(parseInt(e.target.value || "0"))}
            className="border rounded-lg px-3 py-2 bg-transparent"
          />
        </Field>
        <Field label="Nombre de titres">
          <input
            type="number"
            min={5}
            max={100}
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value || "0"))}
            className="border rounded-lg px-3 py-2 bg-transparent"
          />
        </Field>
        <Field label="Profil">
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-transparent"
          >
            <option value="prudent">Prudent</option>
            <option value="neutre">Neutre</option>
            <option value="dynamique">Dynamique</option>
          </select>
        </Field>
        <Field label="Langue">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-transparent"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </Field>
      </motion.div>

      <div className="flex items-center gap-2 bg-white rounded-2xl p-4">
        <button
          onClick={onRun}
          disabled={brief.isPending}
          className="px-4 py-2 rounded-lg bg-primary text-white dark:bg-white dark:text-black"
        >
          {brief.isPending ? "Génération…" : "Générer le brief"}
        </button>
        {brief.isPending && (
          <button
            onClick={onStop}
            className="px-3 py-2 rounded-lg border hover:bg-zinc-50"
          >
            Arrêter
          </button>
        )}
        {toolMsg && <ToolStatus msg={toolMsg} />}
        {brief.isError && (
          <span className="text-red-600 text-sm">
            Erreur: {(brief.error as any)?.message || "échec"}
          </span>
        )}
      </div>

      <div className="min-h-[220px] border rounded-lg p-4 bg-white">
        {brief.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <MarkdownViewer markdown={brief.data?.markdown} />
        )}
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
  const [toolMsg, setToolMsg] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll
  React.useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [thread, chat.isPending]);

  const send = () => {
    const message = input.trim();
    if (!message) return;

    setThread((t) => [...t, { role: "user", content: message }]);
    setInput("");

    const history = [...thread, { role: "user", content: message }]
      .slice(-6)
      .map((m) => `${m.role === "user" ? "Utilisateur" : "Assistant"}: ${m.content}`);

    // annulation précédente
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setToolMsg("L’Assistant consulte les outils MCP…");

    chat.mutate(
      { message, history, lang, risk_profile: risk},
      {
        onSuccess: (res) =>
          setThread((t) => [...t, { role: "assistant", content: res.markdown }]),
        onSettled: () => setToolMsg(null),
      }
    );
  };

  const stop = () => {
    abortRef.current?.abort();
    setToolMsg(null);
  };

  return (
    <div className="space-y-4">
      <motion.div
        layout
        className="grid sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl"
      >
        <Field label="Langue">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-transparent"
          >
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </Field>
        <Field label="Profil">
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-transparent"
          >
            <option value="prudent">Prudent</option>
            <option value="neutre">Neutre</option>
            <option value="dynamique">Dynamique</option>
          </select>
        </Field>
        <div className="flex items-end gap-2">
          {toolMsg && <ToolStatus msg={toolMsg} />}
        </div>
      </motion.div>

      <div
        ref={scrollerRef}
        className="border rounded-lg p-4 space-y-4 h-124 bg-white overflow-y-scroll"
      >
        {thread.length === 0 && (
          <p className="text-sm text-zinc-500">
            Pose une question (ex.&nbsp;: «&nbsp;3 points clés de la semaine crypto&nbsp;»).
          </p>
        )}

        <AnimatePresence initial={false}>
          {thread.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className={m.role === "user" ? "text-right" : "text-left"}
            >
              {m.role === "user" ? (
                <div className="inline-block rounded-2xl px-3 py-2 bg-zinc-100 dark:bg-zinc-800 max-w-[85%]">
                  <span className="text-sm">{m.content}</span>
                </div>
              ) : (
                <div className="inline-block rounded-2xl px-3 py-2 border max-w-[85%]">
                  
                  <MarkdownViewer markdown={m.content} />
                </div>
              )}
            </motion.div>
          ))}

          {/* Indicateur “Assistant écrit …” */}
          {chat.isPending && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 border">
                <span className="text-sm">Assistant</span>
                <span className="inline-flex gap-1">
                  <i className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0ms]" />
                  <i className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:120ms]" />
                  <i className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:240ms]" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        {chat.isPending && (
          <button
            onClick={stop}
            className="px-3 py-2 rounded-lg border hover:bg-zinc-50"
          >
            Arrêter
          </button>
        )}
      </div>

      {chat.isError && (
        <p className="text-red-600 text-sm">
          Erreur: {(chat.error as any)?.message || "échec"}
        </p>
      )}
    </div>
  );
}
