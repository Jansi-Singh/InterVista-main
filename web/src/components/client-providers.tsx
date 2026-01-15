"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { SmoothScroll } from "@/components/smooth-scroll";

export function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </AuthProvider>
    </ThemeProvider>
  );
}
