import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "./client";

export interface RealtimeMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments: string[];
  is_read: boolean;
  created_at: string;
}

/**
 * Subscribe to new messages in a conversation.
 * Returns a channel that can be unsubscribed when the component unmounts.
 */
export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: RealtimeMessage) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onNewMessage(payload.new as RealtimeMessage);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to message read status updates in a conversation.
 */
export function subscribeToReadStatus(
  conversationId: string,
  onReadUpdate: (messageId: string) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`read-status:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        const updated = payload.new as RealtimeMessage;
        if (updated.is_read) {
          onReadUpdate(updated.id);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a realtime channel.
 */
export function unsubscribeChannel(channel: RealtimeChannel) {
  const supabase = createClient();
  supabase.removeChannel(channel);
}

/**
 * Smart notification logic: determines if a user should be notified
 * about a new message. Returns false if the user is currently viewing
 * the conversation (preventing duplicate notifications).
 */
export function shouldNotifyUser(
  activeConversationId: string | null,
  incomingConversationId: string
): boolean {
  return activeConversationId !== incomingConversationId;
}
