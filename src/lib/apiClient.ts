import { mockActivities, mockProjects, mockTimeEntries } from "./mockData";
import { supabase } from "@/integrations/supabase/client";

let apiBaseUrl = "http://localhost:3000/api";

export const setApiBaseUrl = (url: string) => {
  apiBaseUrl = url;
};

export const getApiBaseUrl = () => apiBaseUrl;

// Mock API client - replace with real API calls later
export const apiClient = {
  async getActivities() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockActivities;
  },

  async getProjects() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProjects;
  },

  async getTimeEntries() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTimeEntries;
  },

  async generateNarrative(activityId: string) {
    const activity = mockActivities.find(a => a.id === activityId);
    
    const { data, error } = await supabase.functions.invoke('generate-narrative', {
      body: {
        activityName: activity?.appName || 'Unknown',
        duration: activity?.duration || '0m',
        timestamp: activity?.timestamp || new Date().toISOString()
      }
    });

    if (error) throw error;
    return data.narrative;
  },

  async getSmartSuggestions() {
    const untaggedActivities = mockActivities.filter(a => !a.projectId).slice(0, 5);
    
    const { data, error } = await supabase.functions.invoke('suggest-projects', {
      body: {
        activities: untaggedActivities,
        projects: mockProjects
      }
    });

    if (error) throw error;
    return data.suggestions || [];
  },

  async batchProcessNarratives(entries: any[]) {
    const { data, error } = await supabase.functions.invoke('batch-process', {
      body: { entries }
    });

    if (error) throw error;
    return data;
  },

  async createTimeEntry(entry: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id: Date.now().toString(), ...entry };
  },

  async updateTimeEntry(id: string, entry: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id, ...entry };
  },

  async deleteTimeEntry(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  async testConnection() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { connected: true, message: "Connected successfully" };
  },
};
