import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import createApiClient from "../services/api";

const AppContext = createContext(null);

// PUBLIC_INTERFACE
export const AppProvider = ({ children }) => {
  /**
   * Global app provider for theme management and API client.
   */
  const [theme, setTheme] = useState("light");
  const api = useMemo(() => createApiClient(), []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  const value = useMemo(
    () => ({ theme, toggleTheme, api }),
    [theme, toggleTheme, api]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// PUBLIC_INTERFACE
export const useApp = () => {
  /**
   * Hook to access global app context
   */
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
