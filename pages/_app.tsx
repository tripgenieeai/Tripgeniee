import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout";
import { setBaseUrl } from "@/lib/api-client";
import "@/index.css";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
  setBaseUrl(process.env.NEXT_PUBLIC_API_URL);
}

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tripgeniee-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
