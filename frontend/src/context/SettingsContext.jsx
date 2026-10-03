import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    storeName: 'GT Clothing Hub Studio',
    brandName: 'GT CLOTHING HUB',
    supportEmail: 'support@gtclothinghub.com',
    supportPhone: '+91 98765 43210',
    businessMode: 'PRE_REGISTRATION',
    gstRatePercentage: 5,
    shippingFee: 79,
    freeShippingThreshold: 999,
    codEnabled: true,
    codExtraFee: 49,
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.warn('Failed to load website settings, using defaults');
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loadingSettings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
