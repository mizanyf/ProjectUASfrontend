import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SystemContext = createContext(null);

export const DEFAULTS = {
  appName:      'MoneFlo',
  tagline:      'Sistem Keuangan Organisasi',
  sidebarSub:   'Keuangan Organisasi',
  logoUrl:      null,   // null = pakai asset bawaan (MoneFloLogo.png)
  logo2Url:     null,   // null = pakai asset bawaan (MoneFloLogo2.png)
  faviconUrl:   null,   // null = pakai /favicon.svg bawaan
  announcement: '',     // teks pengumuman (kosong = tidak tampil)
  contactEmail: 'admin@moneflo.com',
  registOpen:   true,   // pendaftaran organisasi baru dibuka/ditutup
};

export function SystemProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  const updateSettings = useCallback((patch) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULTS);
  }, []);

  /* Sync page title + favicon ke <head> secara real-time */
  useEffect(() => {
    document.title = `${settings.appName} - ${settings.tagline}`;
  }, [settings.appName, settings.tagline]);

  useEffect(() => {
    if (!settings.faviconUrl) return;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = settings.faviconUrl;
  }, [settings.faviconUrl]);

  return (
    <SystemContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  return useContext(SystemContext);
}
