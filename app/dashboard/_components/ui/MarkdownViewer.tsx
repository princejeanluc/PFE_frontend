// app/_components/ui/MarkdownViewer.tsx
import Markdown from "./Markdown";

export default function MarkdownViewer({ markdown }: { markdown?: string }) {
  if (!markdown) return null;
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <Markdown content={markdown} className="mt-2" />
    </div>
  );
}
