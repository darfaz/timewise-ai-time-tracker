import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

type AppMode = 'legal' | 'general';
type AppTier = 'FREEMIUM' | 'LEGAL_BASIC' | 'INS_DEF';

interface UiConfig {
  mode: AppMode;
  tier: AppTier;
  productName: string;
  loaded: boolean;
}

interface ConfigContextType {
  uiConfig: UiConfig;
  mode: AppMode;
  tier: AppTier;
  LEGAL_MODE: boolean;
  PRODUCT_NAME: string;
  API_BASE_URL: string;
  isConnected: boolean;
  onboardingCompleted: boolean;
  setMode: (mode: AppMode) => void;
  setTier: (tier: AppTier) => void;
  setApiBaseUrl: (url: string) => void;
  toggleMode: () => void;
  completeOnboarding: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'timewise_config';
const MODE_OVERRIDE_KEY = 'timewise_mode_override';

const isDevelopment = import.meta.env.DEV;

const DEFAULT_CONTEXT: ConfigContextType = {
  uiConfig: { mode: 'general', tier: 'FREEMIUM', productName: 'TimeWise', loaded: false },
  mode: 'general',
  tier: 'FREEMIUM',
  LEGAL_MODE: false,
  PRODUCT_NAME: 'TimeWise',
  API_BASE_URL: 'http://localhost:3000/api',
  isConnected: false,
  onboardingCompleted: false,
  setMode: () => {},
  setTier: () => {},
  setApiBaseUrl: () => {},
  toggleMode: () => {},
  completeOnboarding: () => {},
};

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [uiConfig, setUiConfig] = useState<UiConfig>({
    mode: 'general',
    tier: 'FREEMIUM',
    productName: 'TimeWise',
    loaded: false,
  });
  const [API_BASE_URL, setApiBaseUrlState] = useState<string>('http://localhost:3000/api');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);

  // Fetch config from API on mount and route change
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Get URL override for dev
        const urlParams = new URLSearchParams(window.location.search);
        const modeParam = urlParams.get('mode');
        
        // Call API to get config
        const apiConfig = await apiClient.getConfig();
        
        // Determine tier and mode with precedence:
        // 1. URL param (always wins for testing)
        // 2. localStorage (dev only)
        // 3. API config (production default)
        let tier: AppTier = apiConfig.tier || 'FREEMIUM';
        let mode: AppMode = tier === 'FREEMIUM' ? 'general' : 'legal';
        
        // In development, check localStorage override first
        if (isDevelopment && !modeParam) {
          const storedOverride = localStorage.getItem(MODE_OVERRIDE_KEY);
          if (storedOverride === 'legal' || storedOverride === 'general') {
            mode = storedOverride as AppMode;
            // Update tier based on mode for dev override
            tier = mode === 'legal' ? 'LEGAL_BASIC' : 'FREEMIUM';
          }
        }
        
        // URL param takes ultimate precedence
        if (modeParam === 'legal' || modeParam === 'general') {
          mode = modeParam as AppMode;
          tier = mode === 'legal' ? 'LEGAL_BASIC' : 'FREEMIUM';
        }
        
        // Determine product name based on tier
        let productName = apiConfig.product_name;
        if (!productName) {
          if (tier === 'FREEMIUM') productName = 'TimeWise';
          else if (tier === 'LEGAL_BASIC') productName = 'BillExact';
          else if (tier === 'INS_DEF') productName = 'BillExact Defense';
        }
        
        setUiConfig({
          mode,
          tier,
          productName,
          loaded: true,
        });
      } catch (error) {
        console.error('Failed to fetch config:', error);
        // Set defaults on error
        setUiConfig({
          mode: 'general',
          tier: 'FREEMIUM',
          productName: 'TimeWise',
          loaded: true,
        });
      }
    };

    fetchConfig();
  }, [API_BASE_URL, location.pathname]);

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

  const setMode = (mode: AppMode) => {
    const tier = mode === 'legal' ? 'LEGAL_BASIC' : 'FREEMIUM';
    setUiConfig(prev => ({
      ...prev,
      mode,
      tier,
      productName: mode === 'legal' ? 'BillExact' : 'TimeWise',
    }));
    
    // Persist to localStorage in dev mode
    if (isDevelopment) {
      localStorage.setItem(MODE_OVERRIDE_KEY, mode);
    }
  };

  const setTier = (tier: AppTier) => {
    const mode = tier === 'FREEMIUM' ? 'general' : 'legal';
    let productName = 'TimeWise';
    if (tier === 'LEGAL_BASIC') productName = 'BillExact';
    else if (tier === 'INS_DEF') productName = 'BillExact Defense';
    
    setUiConfig(prev => ({
      ...prev,
      mode,
      tier,
      productName,
    }));
  };

  const setApiBaseUrl = (url: string) => {
    setApiBaseUrlState(url);
  };

  const toggleMode = () => {
    setUiConfig(prev => {
      const newMode = prev.mode === 'legal' ? 'general' : 'legal';
      const newTier = newMode === 'legal' ? 'LEGAL_BASIC' : 'FREEMIUM';
      
      // Persist to localStorage in dev mode
      if (isDevelopment) {
        localStorage.setItem(MODE_OVERRIDE_KEY, newMode);
        toast({
          title: `${newMode === 'legal' ? 'Legal' : 'General'} Mode Enabled`,
          description: `Switched to ${newMode === 'legal' ? 'BillExact' : 'TimeWise'} (Dev Override)`,
        });
      }
      
      return {
        ...prev,
        mode: newMode,
        tier: newTier,
        productName: newMode === 'legal' ? 'BillExact' : 'TimeWise',
      };
    });
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
  };

  // Dev-only keyboard shortcut: Ctrl/Cmd + Alt + M
  useEffect(() => {
    if (!isDevelopment) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [uiConfig.mode]);

  return (
    <ConfigContext.Provider
      value={{
        uiConfig,
        mode: uiConfig.mode,
        tier: uiConfig.tier,
        LEGAL_MODE: uiConfig.mode === 'legal',
        PRODUCT_NAME: uiConfig.productName,
        API_BASE_URL,
        isConnected,
        onboardingCompleted,
        setMode,
        setTier,
        setApiBaseUrl,
        toggleMode,
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
    if (isDevelopment) {
      console.warn('useConfig accessed outside ConfigProvider; returning default context');
    }
    return DEFAULT_CONTEXT;
  }
  return context;
};

export const useUiConfig = () => {
  const { uiConfig } = useConfig();
  return uiConfig;
};
