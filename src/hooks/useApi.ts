import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useConfig } from '@/contexts/ConfigContext';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  mockActivities, 
  mockCategories, 
  mockMatters, 
  mockClients,
} from '@/lib/mockData';
import { mockBillingEntries, mockExportHistory } from '@/lib/billingData';

// Update API client when base URL changes
export const useApiClient = () => {
  const { API_BASE_URL } = useConfig();

  useEffect(() => {
    apiClient.updateBaseURL(API_BASE_URL);
  }, [API_BASE_URL]);

  return apiClient;
};

// Health & Status hooks
export const useHealthCheck = () => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['health'],
    queryFn: () => client.checkHealth(),
    retry: 1,
    enabled: !client.isMockMode(),
  });
};

export const useActivityWatchStatus = () => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['aw-status'],
    queryFn: () => client.checkActivityWatchStatus(),
    refetchInterval: 30000, // Check every 30 seconds
    enabled: !client.isMockMode(),
  });
};

// Activities hooks
export const useActivities = (params?: { date?: string; start?: string; end?: string }) => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => client.isMockMode() 
      ? Promise.resolve(mockActivities)
      : client.getActivities(params),
    refetchOnWindowFocus: true,
  });
};

export const useSyncActivities = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => client.syncActivities(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Sync complete",
        description: "Activities have been synchronized successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Sync failed",
        description: "Unable to sync activities. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Time Entries hooks
export const useTimeEntries = (filters?: any) => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['time-entries', filters],
    queryFn: () => client.isMockMode()
      ? Promise.resolve([]) // Mock data can be added here
      : client.getTimeEntries(filters),
  });
};

export const useTimeEntry = (id: string) => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['time-entry', id],
    queryFn: () => client.getTimeEntry(id),
    enabled: !!id && !client.isMockMode(),
  });
};

export const useCreateTimeEntry = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (entry: any) => client.createTimeEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast({
        title: "Entry created",
        description: "Time entry has been created successfully.",
      });
    },
  });
};

export const useUpdateTimeEntry = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, entry }: { id: string; entry: any }) => 
      client.updateTimeEntry(id, entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast({
        title: "Entry updated",
        description: "Time entry has been updated successfully.",
      });
    },
  });
};

export const useDeleteTimeEntry = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => client.deleteTimeEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast({
        title: "Entry deleted",
        description: "Time entry has been deleted successfully.",
      });
    },
  });
};

// Categories hooks
export const useCategories = () => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => client.isMockMode()
      ? Promise.resolve(mockCategories)
      : client.getCategories(),
  });
};

export const useCreateCategory = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (category: any) => client.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category created",
        description: "Category has been created successfully.",
      });
    },
  });
};

export const useUpdateCategory = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, category }: { id: string; category: any }) =>
      client.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category updated",
        description: "Category has been updated successfully.",
      });
    },
  });
};

export const useDeleteCategory = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => client.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
      });
    },
  });
};

// Matters hooks
export const useMatters = () => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['matters'],
    queryFn: () => client.isMockMode()
      ? Promise.resolve(mockMatters)
      : client.getMatters(),
  });
};

export const useMatter = (id: string) => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['matter', id],
    queryFn: () => client.getMatter(id),
    enabled: !!id && !client.isMockMode(),
  });
};

export const useCreateMatter = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (matter: any) => client.createMatter(matter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matters'] });
      toast({
        title: "Matter created",
        description: "Matter has been created successfully.",
      });
    },
  });
};

export const useUpdateMatter = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, matter }: { id: string; matter: any }) =>
      client.updateMatter(id, matter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matters'] });
      toast({
        title: "Matter updated",
        description: "Matter has been updated successfully.",
      });
    },
  });
};

// Clients hooks
export const useClients = () => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => client.isMockMode()
      ? Promise.resolve(mockClients)
      : client.getClients(),
  });
};

export const useCreateClient = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (clientData: any) => client.createClient(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client created",
        description: "Client has been created successfully.",
      });
    },
  });
};

export const useUpdateClient = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, client }: { id: string; client: any }) =>
      apiClient.updateClient(id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client updated",
        description: "Client has been updated successfully.",
      });
    },
  });
};

// Compliance hooks
export const useCheckCompliance = () => {
  const client = useApiClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (entries: any[]) => client.checkCompliance(entries),
    onError: () => {
      toast({
        title: "Compliance check failed",
        description: "Unable to check compliance. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useFixComplianceBatch = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (entries: any[]) => client.fixComplianceBatch(entries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-entries'] });
      toast({
        title: "Issues fixed",
        description: "Compliance issues have been automatically corrected.",
      });
    },
  });
};

// LEDES hooks
export const useBillingEntries = () => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['billing-entries'],
    queryFn: () => client.isMockMode()
      ? Promise.resolve(mockBillingEntries)
      : client.getTimeEntries(), // Assuming billing entries are time entries in legal mode
  });
};

export const useGenerateLEDES = () => {
  const client = useApiClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: any) => client.generateLEDES(params),
    onSuccess: (data) => {
      toast({
        title: "LEDES export generated",
        description: "Your billing export is ready to download.",
      });
    },
  });
};

export const useLEDESHistory = () => {
  const client = useApiClient();
  return useQuery({
    queryKey: ['ledes-history'],
    queryFn: () => client.isMockMode()
      ? Promise.resolve(mockExportHistory)
      : client.getLEDESHistory(),
  });
};
