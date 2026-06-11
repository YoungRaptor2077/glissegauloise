"use client";

import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface ChatBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
  senderName?: string;
  isRead?: boolean;
  attachments?: string[];
}

export function ChatBubble({
  content,
  timestamp,
  isSent,
  senderName,
  isRead = false,
  attachments,
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
        {content && (
          <p className="text-sm text-blanc-casse whitespace-pre-wrap">{content}</p>
        )}
        {attachments && attachments.length > 0 && (
          <div className={cn("space-y-2", content ? "mt-2" : "")}>
            {attachments.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-white/10 hover:border-vert-neon/40 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Piece jointe ${index + 1}`}
                  className="max-w-full max-h-64 rounded-lg object-cover"
                />
              </a>
            ))}
          </div>
        )}
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
