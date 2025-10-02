import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const useAI = () => {
  return useMutation({
    mutationFn: (activityId: string) => apiClient.generateNarrative(activityId),
  });
};
