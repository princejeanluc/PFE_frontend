import { useMutation } from "@tanstack/react-query";
import { BriefPayload, ChatPayload, postAssistBrief, postAssistChat } from "../api/assist";

export const useAssistBrief = () =>
  useMutation<{ markdown: string }, any, BriefPayload>({
    mutationFn: (p) => postAssistBrief(p),
  });

export const useAssistChat = () =>
  useMutation<{ markdown: string }, any, ChatPayload>({
    mutationFn: (p) => postAssistChat(p),
  });
