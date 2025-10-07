import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/hooks/use-toast';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private useMockData: boolean;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.useMockData = !baseURL || baseURL.includes('localhost');
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
          toast({
            title: "Network Error",
            description: "Unable to connect to the server. Please check your connection.",
            variant: "destructive",
          });
          return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (error.response.status === 401) {
          // Future: redirect to login
          toast({
            title: "Authentication Required",
            description: "Please log in to continue.",
            variant: "destructive",
          });
          return Promise.reject(error);
        }

        // Handle 400 Bad Request
        if (error.response.status === 400) {
          const errorData = error.response.data as any;
          toast({
            title: "Validation Error",
            description: errorData.message || "Invalid request data.",
            variant: "destructive",
          });
          return Promise.reject(error);
        }

        // Handle 500 Internal Server Error
        if (error.response.status >= 500) {
          toast({
            title: "Server Error",
            description: "Something went wrong on our end. Please try again later.",
            variant: "destructive",
          });
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
  }

  public updateBaseURL(baseURL: string) {
    this.baseURL = baseURL;
    this.useMockData = !baseURL || baseURL.includes('localhost');
    this.client.defaults.baseURL = baseURL;
  }

  public isMockMode() {
    return this.useMockData;
  }

  // Config
  async getConfig() {
    try {
      const { data } = await this.client.get('/config');
      return data;
    } catch (error) {
      // Return defaults if API not available - simulate tier-based config
      return { 
        tier: 'LEGAL_BASIC', // Change this to test: FREEMIUM | LEGAL_BASIC | INS_DEF
        product_name: null 
      };
    }
  }

  // Health & Status
  async checkHealth() {
    const { data } = await this.client.get('/health');
    return data;
  }

  async checkActivityWatchStatus() {
    const { data } = await this.client.get('/aw/status');
    return data;
  }

  // Activities
  async getActivities(params?: { date?: string; start?: string; end?: string }) {
    const { data } = await this.client.get('/aw/activities', { params });
    return data;
  }

  async syncActivities() {
    const { data } = await this.client.post('/activities/sync');
    return data;
  }

  // Time Entries
  async getTimeEntries(filters?: any) {
    const { data } = await this.client.get('/entries', { params: filters });
    return data;
  }

  async getTimeEntry(id: string) {
    const { data } = await this.client.get(`/entries/${id}`);
    return data;
  }

  async createTimeEntry(entry: any) {
    const { data } = await this.client.post('/entries', entry);
    return data;
  }

  async updateTimeEntry(id: string, entry: any) {
    const { data } = await this.client.put(`/entries/${id}`, entry);
    return data;
  }

  async deleteTimeEntry(id: string) {
    const { data } = await this.client.delete(`/entries/${id}`);
    return data;
  }

  async splitTimeEntry(id: string, splits: any) {
    const { data } = await this.client.post(`/entries/${id}/split`, splits);
    return data;
  }

  // Categories
  async getCategories() {
    const { data } = await this.client.get('/categories');
    return data;
  }

  async createCategory(category: any) {
    const { data } = await this.client.post('/categories', category);
    return data;
  }

  async updateCategory(id: string, category: any) {
    const { data } = await this.client.put(`/categories/${id}`, category);
    return data;
  }

  async deleteCategory(id: string) {
    const { data } = await this.client.delete(`/categories/${id}`);
    return data;
  }

  // Matters
  async getMatters() {
    const { data } = await this.client.get('/matters');
    return data;
  }

  async getMatter(id: string) {
    const { data } = await this.client.get(`/matters/${id}`);
    return data;
  }

  async createMatter(matter: any) {
    const { data } = await this.client.post('/matters', matter);
    return data;
  }

  async updateMatter(id: string, matter: any) {
    const { data } = await this.client.put(`/matters/${id}`, matter);
    return data;
  }

  // Clients
  async getClients() {
    const { data } = await this.client.get('/clients');
    return data;
  }

  async createClient(client: any) {
    const { data } = await this.client.post('/clients', client);
    return data;
  }

  async updateClient(id: string, client: any) {
    const { data } = await this.client.put(`/clients/${id}`, client);
    return data;
  }

  // Compliance
  async checkCompliance(entries: any[]) {
    const { data } = await this.client.post('/compliance/check', { entries });
    return data;
  }

  async fixComplianceBatch(entries: any[]) {
    const { data } = await this.client.post('/compliance/fix-batch', { entries });
    return data;
  }

  // LEDES
  async generateLEDES(params: any) {
    const { data } = await this.client.post('/ledes/generate', params);
    return data;
  }

  async getLEDESHistory() {
    const { data } = await this.client.get('/ledes/history');
    return data;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

export default apiClient;
