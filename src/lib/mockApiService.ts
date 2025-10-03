import { apiClient } from '@/lib/api';
import { 
  mockActivities, 
  mockCategories, 
  mockMatters, 
  mockClients,
  Activity,
  Category,
  Matter,
  Client,
} from '@/lib/mockData';
import { mockBillingEntries, BillingEntry, ExportHistory, mockExportHistory } from '@/lib/billingData';

// Local storage keys
const STORAGE_KEYS = {
  ACTIVITIES: 'timewise_activities',
  CATEGORIES: 'timewise_categories',
  MATTERS: 'timewise_matters',
  CLIENTS: 'timewise_clients',
  BILLING_ENTRIES: 'timewise_billing_entries',
  EXPORT_HISTORY: 'timewise_export_history',
};

class MockApiService {
  // Helper to get data from localStorage with fallback to mock data
  private getStorageData<T>(key: string, fallback: T[]): T[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorageData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Activities
  async getActivities(params?: { date?: string; start?: string; end?: string }): Promise<Activity[]> {
    const activities = this.getStorageData(STORAGE_KEYS.ACTIVITIES, mockActivities);
    // Filter by date if provided
    if (params?.date) {
      const targetDate = new Date(params.date);
      return activities.filter(a => {
        const activityDate = new Date(a.timestamp);
        return activityDate.toDateString() === targetDate.toDateString();
      });
    }
    return activities;
  }

  async syncActivities(): Promise<{ success: boolean; count: number }> {
    return { success: true, count: 5 };
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.getStorageData(STORAGE_KEYS.CATEGORIES, mockCategories);
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    const categories = this.getStorageData(STORAGE_KEYS.CATEGORIES, mockCategories);
    const newCategory: Category = {
      id: Date.now().toString(),
      name: category.name || '',
      color: category.color || 'hsl(217, 91%, 60%)',
      icon: category.icon || 'Tag',
      keywords: category.keywords || [],
      totalTimeThisWeek: 0,
      entryCount: 0,
    };
    categories.push(newCategory);
    this.setStorageData(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const categories = this.getStorageData(STORAGE_KEYS.CATEGORIES, mockCategories);
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...category };
      this.setStorageData(STORAGE_KEYS.CATEGORIES, categories);
      return categories[index];
    }
    throw new Error('Category not found');
  }

  async deleteCategory(id: string): Promise<void> {
    const categories = this.getStorageData(STORAGE_KEYS.CATEGORIES, mockCategories);
    const filtered = categories.filter(c => c.id !== id);
    this.setStorageData(STORAGE_KEYS.CATEGORIES, filtered);
  }

  // Matters
  async getMatters(): Promise<Matter[]> {
    return this.getStorageData(STORAGE_KEYS.MATTERS, mockMatters);
  }

  async createMatter(matter: Partial<Matter>): Promise<Matter> {
    const matters = this.getStorageData(STORAGE_KEYS.MATTERS, mockMatters);
    const newMatter: Matter = {
      id: Date.now().toString(),
      matterId: matter.matterId || '',
      matterName: matter.matterName || '',
      clientId: matter.clientId || '',
      caseType: matter.caseType || 'Other',
      status: matter.status || 'Active',
      billingRules: matter.billingRules || '',
      assignedAttorneys: matter.assignedAttorneys || [],
      notes: matter.notes || '',
      totalTimeLogged: 0,
      lastActivityDate: new Date(),
      createdAt: new Date(),
    };
    matters.push(newMatter);
    this.setStorageData(STORAGE_KEYS.MATTERS, matters);
    return newMatter;
  }

  async updateMatter(id: string, matter: Partial<Matter>): Promise<Matter> {
    const matters = this.getStorageData(STORAGE_KEYS.MATTERS, mockMatters);
    const index = matters.findIndex(m => m.id === id);
    if (index !== -1) {
      matters[index] = { ...matters[index], ...matter };
      this.setStorageData(STORAGE_KEYS.MATTERS, matters);
      return matters[index];
    }
    throw new Error('Matter not found');
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return this.getStorageData(STORAGE_KEYS.CLIENTS, mockClients);
  }

  async createClient(client: Partial<Client>): Promise<Client> {
    const clients = this.getStorageData(STORAGE_KEYS.CLIENTS, mockClients);
    const newClient: Client = {
      id: Date.now().toString(),
      name: client.name || '',
      clientId: client.clientId || '',
      industry: client.industry || '',
      billingContact: client.billingContact || '',
      email: client.email || '',
      phone: client.phone || '',
      billingGuidelines: client.billingGuidelines,
      createdAt: new Date(),
    };
    clients.push(newClient);
    this.setStorageData(STORAGE_KEYS.CLIENTS, clients);
    return newClient;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    const clients = this.getStorageData(STORAGE_KEYS.CLIENTS, mockClients);
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...client };
      this.setStorageData(STORAGE_KEYS.CLIENTS, clients);
      return clients[index];
    }
    throw new Error('Client not found');
  }

  // Billing Entries
  async getBillingEntries(): Promise<BillingEntry[]> {
    return this.getStorageData(STORAGE_KEYS.BILLING_ENTRIES, mockBillingEntries);
  }

  // LEDES History
  async getLEDESHistory(): Promise<ExportHistory[]> {
    return this.getStorageData(STORAGE_KEYS.EXPORT_HISTORY, mockExportHistory);
  }
}

export const mockApiService = new MockApiService();
