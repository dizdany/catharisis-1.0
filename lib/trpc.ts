import { createTRPCReact } from "@trpc/react-query";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('Using EXPO_PUBLIC_RORK_API_BASE_URL:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Fallback to the origin from app.json
  console.log('Using fallback base URL: https://rork.com');
  return "https://rork.com";
};

// Create the tRPC client for React Query
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: () => {
        return {
          'Content-Type': 'application/json',
        };
      },
      fetch: (url, options) => {
        console.log('tRPC request to:', url);
        console.log('tRPC request options:', JSON.stringify(options, null, 2));
        return fetch(url, options)
          .then(response => {
            console.log('tRPC response status:', response.status);
            if (!response.ok) {
              console.error('tRPC response not ok:', response.status, response.statusText);
            }
            return response;
          })
          .catch(error => {
            console.error('tRPC fetch error:', error);
            console.error('Error details:', {
              message: error.message,
              name: error.name,
              stack: error.stack
            });
            throw new Error(`Network request failed: ${error.message}`);
          });
      },
    }),
  ],
});

// Create a standalone client for non-React usage
export const standaloneClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: () => {
        return {
          'Content-Type': 'application/json',
        };
      },
      fetch: (url, options) => {
        console.log('tRPC standalone request to:', url);
        console.log('tRPC standalone request options:', JSON.stringify(options, null, 2));
        return fetch(url, options)
          .then(response => {
            console.log('tRPC standalone response status:', response.status);
            if (!response.ok) {
              console.error('tRPC standalone response not ok:', response.status, response.statusText);
            }
            return response;
          })
          .catch(error => {
            console.error('tRPC standalone fetch error:', error);
            console.error('Standalone error details:', {
              message: error.message,
              name: error.name,
              stack: error.stack
            });
            throw new Error(`Network request failed: ${error.message}`);
          });
      },
    }),
  ],
});