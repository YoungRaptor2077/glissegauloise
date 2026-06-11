"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChatInputProps {
  onSend: (message: string, attachments?: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  placeholder = "Ecrivez votre message...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const clearFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  const handleSend = useCallback(async () => {
    const trimmed = message.trim();
    if ((!trimmed && !selectedFile) || disabled || uploading) return;

    let attachments: string[] = [];

    if (selectedFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await fetch("/api/upload-chat-image", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            attachments = [data.url];
          }
        }
      } catch {
        // Upload failed silently
      } finally {
        setUploading(false);
      }
    }

    onSend(trimmed || "", attachments.length > 0 ? attachments : undefined);
    setMessage("");
    clearFile();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, disabled, uploading, selectedFile, onSend, clearFile]);

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
    <div className="border-t border-white/5 bg-gris-anthracite/50">
      {/* File preview */}
      {previewUrl && (
        <div className="px-4 pt-3 pb-1">
          <div className="relative inline-block">
            <Image
              src={previewUrl}
              alt="Preview"
              width={80}
              height={80}
              className="h-20 w-20 rounded-lg object-cover border border-white/10"
              unoptimized
            />
            <button
              type="button"
              onClick={clearFile}
              className="absolute -top-2 -right-2 rounded-full bg-noir-mat border border-white/20 p-0.5 text-blanc-casse/60 hover:text-blanc-casse transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-2 p-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2 rounded-xl text-blanc-casse/40 hover:text-blanc-casse/70 hover:bg-white/5 transition-colors disabled:opacity-50"
          title="Joindre une image"
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
          disabled={disabled || uploading}
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
          disabled={(!message.trim() && !selectedFile) || disabled || uploading}
          className={cn(
            "p-3 rounded-xl transition-all",
            (message.trim() || selectedFile) && !disabled && !uploading
              ? "bg-vert-neon text-noir-mat hover:bg-vert-neon-dark"
              : "bg-gris-anthracite-light text-blanc-casse/30 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <div className="h-5 w-5 border-2 border-blanc-casse/30 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
