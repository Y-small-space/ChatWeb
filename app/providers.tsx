"use client";

import { Provider } from "react-redux";
import { store } from "../src/store";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { LanguageProvider } from "../src/contexts/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LanguageProvider>
    </Provider>
  );
}
