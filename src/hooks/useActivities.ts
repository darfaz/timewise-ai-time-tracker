import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const useActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: apiClient.getActivities,
  });
};
