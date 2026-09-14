import { http } from "@/lib/api/client";
import type { ChatHistoryResponse, ChatResponse } from "@/types/chat";

export const chatApi = {
  send(message: string, conversationId?: string) {
    return http.post<ChatResponse>("/api/chat/message", {
      message,
      conversation_id: conversationId,
    });
  },
  history(conversationId?: string) {
    return http.get<ChatHistoryResponse>("/api/chat/history", {
      query: { conversation_id: conversationId },
    });
  },
};