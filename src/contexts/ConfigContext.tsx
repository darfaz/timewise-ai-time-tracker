import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConfigContextType {
  LEGAL_MODE: boolean;
  PRODUCT_NAME: string;
  API_BASE_URL: string;
  setLegalMode: (mode: boolean) => void;
  setApiBaseUrl: (url: string) => void;
  toggleLegalMode: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'timewise_config';

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [LEGAL_MODE, setLegalModeState] = useState<boolean>(false);
  const [API_BASE_URL, setApiBaseUrlState] = useState<string>('http://localhost:3000/api');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const config = JSON.parse(stored);
        setLegalModeState(config.LEGAL_MODE ?? false);
        setApiBaseUrlState(config.API_BASE_URL ?? 'http://localhost:3000/api');
      } catch (error) {
        console.error('Failed to parse stored config:', error);
      }
    }
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    const config = { LEGAL_MODE, API_BASE_URL };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [LEGAL_MODE, API_BASE_URL]);

  const PRODUCT_NAME = LEGAL_MODE ? 'BillExact' : 'TimeWise';

  const setLegalMode = (mode: boolean) => {
    setLegalModeState(mode);
  };

  const setApiBaseUrl = (url: string) => {
    setApiBaseUrlState(url);
  };

  const toggleLegalMode = () => {
    setLegalModeState(prev => !prev);
  };

  return (
    <ConfigContext.Provider
      value={{
        LEGAL_MODE,
        PRODUCT_NAME,
        API_BASE_URL,
        setLegalMode,
        setApiBaseUrl,
        toggleLegalMode,
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
