import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: apiClient.getProjects,
  });
};
