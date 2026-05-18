"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  placeholder = "Ecrivez votre message...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex items-end gap-2 p-4 border-t border-white/5 bg-gris-anthracite/50">
      <button
        type="button"
        className="p-2 rounded-xl text-blanc-casse/40 hover:text-blanc-casse/70 hover:bg-white/5 transition-colors"
        title="Joindre un fichier"
      >
        <Paperclip className="h-5 w-5" />
      </button>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleInput();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "flex-1 resize-none rounded-xl bg-noir-mat border border-white/10 px-4 py-3",
          "text-sm text-blanc-casse placeholder:text-blanc-casse/30",
          "focus:outline-none focus:border-vert-neon/50 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={cn(
          "p-3 rounded-xl transition-all",
          message.trim() && !disabled
            ? "bg-vert-neon text-noir-mat hover:bg-vert-neon-dark"
            : "bg-gris-anthracite-light text-blanc-casse/30 cursor-not-allowed"
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}
