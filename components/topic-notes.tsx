"use client";

import ReactMarkdown from "react-markdown";

export function TopicNotes({ markdown }: { markdown: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <article
        className="max-w-none
        [&>h2]:font-display [&>h2]:text-lg [&>h2]:text-primary [&>h2]:mt-8 [&>h2]:mb-2 first:[&>h2]:mt-0
        [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-border
        [&>p]:text-muted-foreground [&>p]:text-sm [&>p]:mb-3 [&>p]:leading-relaxed
        [&_ul]:space-y-2.5 [&_ol]:space-y-2.5 [&_ol]:list-decimal [&_ol]:pl-5
        [&_li]:text-foreground/90 [&_li]:text-sm [&_li]:leading-relaxed [&_li]:pl-1
        [&_ul_li]:relative [&_ul_li]:pl-4
        [&_ul_li]:before:content-['·'] [&_ul_li]:before:absolute [&_ul_li]:before:left-0
        [&_ul_li]:before:text-accent [&_ul_li]:before:font-bold [&_ul_li]:before:text-lg
        [&_strong]:text-foreground [&_strong]:font-semibold
        [&_code]:text-secondary [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px]"
      >
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}