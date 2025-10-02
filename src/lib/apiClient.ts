import { mockActivities, mockProjects, mockTimeEntries } from "./mockData";

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const narratives = [
      "Developed responsive UI components using React and Tailwind CSS, focusing on mobile-first design principles and accessibility standards.",
      "Collaborated with design team on user interface improvements, implemented feedback from user testing sessions.",
      "Debugged production issues related to API integration, optimized database queries for better performance.",
      "Created comprehensive documentation for new features, including setup guides and best practices.",
      "Reviewed pull requests and provided constructive feedback to team members on code quality and architecture.",
    ];
    return narratives[Math.floor(Math.random() * narratives.length)];
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
