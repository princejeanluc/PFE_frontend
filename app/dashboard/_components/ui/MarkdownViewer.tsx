import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { markdown?: string };

export default function MarkdownViewer({ markdown }: Props) {
  if (!markdown) return null;
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
