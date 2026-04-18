"use client";

import { createContext, useContext, useEffect, useState } from "react";


const ScreenContext = createContext({ isMobile: false });

export const ScreenProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");

    const handleChange = () => setIsMobile(media.matches);

    handleChange();
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  return (
    <ScreenContext.Provider value={{ isMobile }}>
        {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = () => useContext(ScreenContext);