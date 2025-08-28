import { api } from "./index";

export type BriefPayload = {
  since_hours?: number;   // ex 24, 72, 168
  limit?: number;         // ex 20, 50
  lang?: string;          // "fr" par défaut côté serveur
  risk_profile?: string;  // "prudent" par défaut
};

export type ChatPayload = {
  message: string;
  history?: string[];     // facultatif
  lang?: string;
  risk_profile?: string;
};

export const postAssistBrief = async (payload: BriefPayload) => {
  const { data } = await api.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assist/brief/`,
    payload
  );
  return data as { markdown: string };
};

export const postAssistChat = async (payload: ChatPayload) => {
  const { data } = await api.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assist/chat/`,
    payload
  );
  return data as { markdown: string };
};
