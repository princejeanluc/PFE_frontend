import { api } from "@/core/http/api";

export type BriefPayload = {
  since_hours?: number;
  limit?: number;
  lang?: string;
  risk_profile?: string;
};

export type ChatPayload = {
  message: string;
  history?: string[];
  lang?: string;
  risk_profile?: string;
};

export const postAssistBrief = async (payload: BriefPayload) => {
  const { data } = await api.post("/api/assist/brief/", payload);
  return data as { markdown: string };
};

export const postAssistChat = async (payload: ChatPayload) => {
  const { data } = await api.post("/api/assist/chat/", payload);
  return data as { markdown: string };
};
