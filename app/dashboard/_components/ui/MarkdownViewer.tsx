import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Markdown from "./Markdown";

type Props = { markdown?: string };

export default function MarkdownViewer({ markdown }: Props) {
  if (!markdown) return null;
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
        {markdown && <Markdown content={markdown} className="mt-4" />}
    </div>
  );
}
