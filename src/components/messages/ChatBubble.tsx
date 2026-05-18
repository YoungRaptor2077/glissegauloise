"use client";

import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface ChatBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
  senderName?: string;
  isRead?: boolean;
}

export function ChatBubble({
  content,
  timestamp,
  isSent,
  senderName,
  isRead = false,
}: ChatBubbleProps) {
  return (
    <div
      className={cn("flex w-full mb-3", isSent ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isSent
            ? "bg-vert-neon/20 border border-vert-neon/30 rounded-br-md"
            : "bg-gris-anthracite border border-white/5 rounded-bl-md"
        )}
      >
        {senderName && !isSent && (
          <p className="text-xs font-medium text-vert-neon mb-1">{senderName}</p>
        )}
        <p className="text-sm text-blanc-casse whitespace-pre-wrap">{content}</p>
        <div
          className={cn(
            "flex items-center gap-1 mt-1",
            isSent ? "justify-end" : "justify-start"
          )}
        >
          <span className="text-[10px] text-blanc-casse/40">{timestamp}</span>
          {isSent && (
            <>
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-vert-neon" />
              ) : (
                <Check className="h-3 w-3 text-blanc-casse/40" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
