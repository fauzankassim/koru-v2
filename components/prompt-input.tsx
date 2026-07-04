"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

export function PromptInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  return (
    <div
      className="relative flex items-end rounded-2xl border border-border bg-card
      focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10
      transition-colors"
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none bg-transparent px-4 py-3.5 pr-14 text-[15px] not-italic
        font-[family-name:var(--font-body)] text-foreground placeholder:text-muted-foreground/70
        focus:outline-none disabled:opacity-60 max-h-[180px] overflow-y-auto"
      />
      <button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        aria-label="Plant topic"
        className="absolute right-2.5 bottom-2.5 h-8 w-8 rounded-full bg-primary text-primary-foreground
        flex items-center justify-center transition-all
        disabled:opacity-30 disabled:cursor-not-allowed
        enabled:hover:scale-105 enabled:active:scale-95"
      >
        {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
      </button>
    </div>
  );
}