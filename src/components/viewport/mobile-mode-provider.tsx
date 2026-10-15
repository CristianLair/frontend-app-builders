"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type MobileModeContextValue = {
  mobileMode: boolean;
  setMobileMode: (value: boolean) => void;
  toggleMobileMode: () => void;
};

const MobileModeContext = createContext<MobileModeContextValue | null>(null);

const STORAGE_KEY = "presto-mobile-mode";

export function MobileModeProvider({ children }: { children: ReactNode }) {
  const [mobileMode, setMobileModeState] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) === "on") {
      setMobileModeState(true);
    }
  }, []);

  const setMobileMode = useCallback((value: boolean) => {
    setMobileModeState(value);
    window.localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
  }, []);

  const toggleMobileMode = useCallback(() => {
    setMobileModeState((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      return next;
    });
  }, []);

  return (
    <MobileModeContext.Provider value={{ mobileMode, setMobileMode, toggleMobileMode }}>
      {children}
    </MobileModeContext.Provider>
  );
}

export function useMobileMode() {
  const value = useContext(MobileModeContext);
  if (!value) throw new Error("useMobileMode must be used within MobileModeProvider");
  return value;
}
