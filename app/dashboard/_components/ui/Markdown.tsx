// components/Markdown.tsx
"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import cn from "classnames";
import copy from "copy-to-clipboard";
import { Copy } from "lucide-react";
import Image from "next/image";

function normalizeMd(src: string) {
  // Trim and remove a surrounding fenced block like ```md ... ```
  const trimmed = src.trim();
  const fence = /^```[a-zA-Z0-9_-]*\n([\s\S]*?)\n```$/m;
  const m = trimmed.match(fence);
  return m ? m[1].trim() : trimmed;
}

// Autorise className sur <code> pour le highlight
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
    span: [...(defaultSchema.attributes?.span || []), ["className"]],
  },
};

function CopyBtn({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      className={cn(
        "absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
        ok
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-zinc-200 bg-white/80 text-zinc-700 hover:bg-zinc-50"
      )}
      onClick={() => {
        copy(value);
        setOk(true);
        setTimeout(() => setOk(false), 1200);
      }}
      title="Copier le code"
      aria-label="Copier le code"
    >
      <Copy className="h-4 w-4" />
      {ok ? "Copié" : "Copier"}
    </button>
  );
}

export default function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("prose prose-zinc max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw, // autorise un peu de HTML
          [rehypeSanitize, schema], // sécurise
          [rehypeHighlight, { detect: true }], // coloration
          rehypeKatex, // maths
        ]}
        components={{
          h1: (p) => <h1 {...p} className="text-3xl font-extrabold tracking-tight !mt-6 !mb-3" />,
          h2: (p) => <h2 {...p} className="text-2xl font-bold tracking-tight !mt-6 !mb-2" />,
          h3: (p) => <h3 {...p} className="text-xl font-semibold !mt-5 !mb-2" />,
          p: (p) => <p {...p} className="leading-relaxed" />,
          a: (p) => (
            <a
              {...p}
              className="text-purple-600 underline decoration-purple-300 hover:text-purple-700"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          blockquote: ({ children, ...rest }) => (
            <div className="my-4 rounded-xl border border-purple-200/60 bg-purple-50/60 p-4 text-purple-900">
              <blockquote {...rest} className="m-0">
                {children}
              </blockquote>
            </div>
          ),
          table: (p) => (
            <div className="not-prose my-4 overflow-hidden rounded-xl border">
              <table {...p} className="w-full border-collapse text-sm" />
            </div>
          ),
          th: (p) => <th {...p} className="bg-zinc-50 p-3 text-left font-medium" />,
          td: (p) => <td {...p} className="border-t p-3 align-top" />,
          img: ({ src = "", alt = "" }) => (
            <Image src={src.toString()} alt={alt} className="rounded-xl border" />
            
          ),
          code({ className, children, ...props }) {
            const txt = String(children ?? "");
            /* Property 'inline' does not exist on type 'ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps'
            if (inline) {
              return (
                <code
                  className="rounded bg-zinc-100 px-1 py-0.5 text-[0.95em] text-zinc-900"
                  {...props}
                >
                  {txt}
                </code>
              );
            }*/
            const lang = (className || "").replace("language-", "") || "text";
            return (
              <pre className="relative rounded-xl border bg-white p-4">
                <code className={className} {...props}>
                  {txt}
                </code>
                <CopyBtn value={txt} />
                <div className="absolute left-0 top-0 rounded-br-lg bg-zinc-100 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
                  {lang}
                </div>
              </pre>
            );
          },
        }}
      >
        { normalizeMd(content)}
      </ReactMarkdown>
    </div>
  );
}
