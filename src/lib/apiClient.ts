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

  async rewriteEntryNarrative(entryId: string) {
    const activity = mockActivities.find(a => a.id === entryId);
    
    const { data, error } = await supabase.functions.invoke('generate-narrative', {
      body: {
        activityName: activity?.appName || 'Unknown',
        duration: activity?.duration || '0m',
        timestamp: activity?.timestamp || new Date().toISOString()
      }
    });

    if (error) throw error;
    return data;
  },

  async rewriteDayNarratives(date: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const entriesForDay = mockActivities.filter(a => 
      new Date(a.timestamp).toDateString() === new Date(date).toDateString()
    );
    
    return { 
      success: true, 
      count: entriesForDay.length,
      message: `Rewrote ${entriesForDay.length} entries` 
    };
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

  async get(url: string) {
    // Mock API implementation
    if (url.includes('/entry/') && url.includes('/explain')) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock response with sample data
      return {
        data: {
          calendar: [
            { subject: "Team standup - Sprint planning", time: "9:00 AM - 9:30 AM" },
            { subject: "Client review meeting", time: "2:00 PM - 3:00 PM" },
          ],
          emails: [
            { subject: "RE: Project timeline update", sender: "john.doe@example.com" },
            { subject: "Design feedback - Dashboard mockups", sender: "jane.smith@example.com" },
          ],
          activities: [
            { title: "React Documentation - useEffect Hook", host: "react.dev", duration: 15 },
            { title: "Stack Overflow - TypeScript generics", host: "stackoverflow.com", duration: 8 },
          ],
          totalDuration: 45,
        }
      };
    }
    
    throw new Error('Endpoint not implemented');
  },
};
