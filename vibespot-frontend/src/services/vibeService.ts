import api from "../api/axios";

import type {
  SendVibeRequest,
  SendVibeResponse,
  PendingVibesResponse,
} from "../types/vibe";

export const sendVibe = async (
  data: SendVibeRequest
): Promise<SendVibeResponse> => {
  const response = await api.post(
    "/vibes/send",
    data
  );

  return response.data;
};

export const getPendingVibes =
  async (): Promise<PendingVibesResponse> => {
    const response = await api.get(
      "/vibes/pending"
    );

    return response.data;
  };