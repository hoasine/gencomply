"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { WalletProvider } from "@/lib/genlayer/WalletProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Use useState to ensure QueryClient is only created once per component lifecycle
  // This prevents the client from being recreated on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2000,
            refetchOnWindowFocus: false,
            retry: 1,
            throwOnError: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        {children}
      </WalletProvider>
      <Toaster
        position="top-right"
        theme="light"
        richColors
        closeButton
        offset="80px"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid oklch(0.91 0.012 220)",
            color: "oklch(0.22 0.03 240)",
            boxShadow: "0 4px 20px oklch(0.52 0.12 185 / 0.12)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
