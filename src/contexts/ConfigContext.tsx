import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface UiConfig {
  legalMode: boolean;
  productName: string;
  loaded: boolean;
}

interface ConfigContextType {
  uiConfig: UiConfig;
  LEGAL_MODE: boolean;
  PRODUCT_NAME: string;
  API_BASE_URL: string;
  isConnected: boolean;
  onboardingCompleted: boolean;
  setLegalMode: (mode: boolean) => void;
  setApiBaseUrl: (url: string) => void;
  toggleLegalMode: () => void;
  completeOnboarding: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'timewise_config';
const LEGAL_MODE_OVERRIDE_KEY = 'timewise_legal_mode_override';

const isDevelopment = import.meta.env.DEV;

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [uiConfig, setUiConfig] = useState<UiConfig>({
    legalMode: false,
    productName: 'TimeWise',
    loaded: false,
  });
  const [API_BASE_URL, setApiBaseUrlState] = useState<string>('http://localhost:3000/api');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);

  // Fetch config from API on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Get URL override for dev
        const urlParams = new URLSearchParams(window.location.search);
        const legalParam = urlParams.get('legal');
        
        // Call API to get config
        const apiConfig = await apiClient.getConfig();
        
        // Determine legal mode with precedence:
        // 1. URL param (always wins for testing)
        // 2. localStorage (dev only)
        // 3. API config (production default)
        let legalMode = apiConfig.legal_mode || false;
        
        // In development, check localStorage override first
        if (isDevelopment && !legalParam) {
          const storedOverride = localStorage.getItem(LEGAL_MODE_OVERRIDE_KEY);
          if (storedOverride !== null) {
            legalMode = storedOverride === 'true';
          }
        }
        
        // URL param takes ultimate precedence
        if (legalParam === '1') {
          legalMode = true;
        } else if (legalParam === '0') {
          legalMode = false;
        }
        
        // Determine product name
        const productName = apiConfig.product_name || (legalMode ? 'BillExact' : 'TimeWise');
        
        setUiConfig({
          legalMode,
          productName,
          loaded: true,
        });
      } catch (error) {
        console.error('Failed to fetch config:', error);
        // Set defaults on error
        setUiConfig({
          legalMode: false,
          productName: 'TimeWise',
          loaded: true,
        });
      }
    };

    fetchConfig();
  }, [API_BASE_URL]);

  // Load other settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const onboardingComplete = localStorage.getItem('onboarding_completed');
    
    if (stored) {
      try {
        const config = JSON.parse(stored);
        setApiBaseUrlState(config.API_BASE_URL ?? 'http://localhost:3000/api');
      } catch (error) {
        console.error('Failed to parse stored config:', error);
      }
    }
    
    setOnboardingCompleted(onboardingComplete === 'true');
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    const config = { API_BASE_URL };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [API_BASE_URL]);

  // Update API client when URL changes and check connection
  useEffect(() => {
    apiClient.updateBaseURL(API_BASE_URL);
    
    // Check backend connection
    const checkConnection = async () => {
      try {
        await apiClient.checkHealth();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    if (!apiClient.isMockMode()) {
      checkConnection();
      // Check connection every 30 seconds
      const interval = setInterval(checkConnection, 30000);
      return () => clearInterval(interval);
    } else {
      setIsConnected(false);
    }
  }, [API_BASE_URL]);

  const setLegalMode = (mode: boolean) => {
    setUiConfig(prev => ({
      ...prev,
      legalMode: mode,
      productName: mode ? 'BillExact' : 'TimeWise',
    }));
    
    // Persist to localStorage in dev mode
    if (isDevelopment) {
      localStorage.setItem(LEGAL_MODE_OVERRIDE_KEY, mode.toString());
    }
  };

  const setApiBaseUrl = (url: string) => {
    setApiBaseUrlState(url);
  };

  const toggleLegalMode = () => {
    setUiConfig(prev => {
      const newMode = !prev.legalMode;
      
      // Persist to localStorage in dev mode
      if (isDevelopment) {
        localStorage.setItem(LEGAL_MODE_OVERRIDE_KEY, newMode.toString());
        toast({
          title: `${newMode ? 'Legal' : 'Standard'} Mode Enabled`,
          description: `Switched to ${newMode ? 'BillExact' : 'TimeWise'} (Dev Override)`,
        });
      }
      
      return {
        ...prev,
        legalMode: newMode,
        productName: newMode ? 'BillExact' : 'TimeWise',
      };
    });
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
  };

  // Dev-only keyboard shortcut: Ctrl/Cmd + Alt + L
  useEffect(() => {
    if (!isDevelopment) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleLegalMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [uiConfig.legalMode]);

  return (
    <ConfigContext.Provider
      value={{
        uiConfig,
        LEGAL_MODE: uiConfig.legalMode,
        PRODUCT_NAME: uiConfig.productName,
        API_BASE_URL,
        isConnected,
        onboardingCompleted,
        setLegalMode,
        setApiBaseUrl,
        toggleLegalMode,
        completeOnboarding,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const useUiConfig = () => {
  const { uiConfig } = useConfig();
  return uiConfig;
};
