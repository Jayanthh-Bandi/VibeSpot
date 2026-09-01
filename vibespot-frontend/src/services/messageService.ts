import api from "../api/axios";
import type { Message } from "../types/message";

interface MessagesResponse {
  success: boolean;
  message: string;
  data: Message[];
}

export const getMessages = async (
  matchId: string
): Promise<MessagesResponse> => {
  const response = await api.get(
    `/messages/${matchId}`
  );

  return response.data;
};