import { createContext, useContext, useState, useCallback } from 'react';

export const DEFAULTS = {
  appName:       'MoneFlo',
  tagline:       'Sistem Keuangan Organisasi',
  sidebarSub:    'Keuangan Organisasi',
  contactEmail:  'admin@moneflo.com',
  logoUrl:       null,
  logo2Url:      null,
  faviconUrl:    null,
  announcement:  '',
  registOpen:    true,
};

const SystemContext = createContext(null);

export function SystemProvider({ children }) {
  const [settings, setSettings] = useState({ ...DEFAULTS });

  const updateSettings = useCallback((patch) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULTS });
  }, []);

  return (
    <SystemContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  return useContext(SystemContext);
}
