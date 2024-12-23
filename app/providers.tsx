"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/store";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { LanguageProvider } from "../src/contexts/LanguageContext";
import { AuthCheck } from "../src/components/Auth/AuthCheck";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <ThemeProvider>
            <AuthCheck>{children}</AuthCheck>
          </ThemeProvider>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  );
}
