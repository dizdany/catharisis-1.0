import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes with more permissive settings
app.use("*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Add logging middleware
app.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  console.log('Headers:', Object.fromEntries(c.req.raw.headers.entries()));
  await next();
});

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
    onError: ({ error, path }) => {
      console.error(`tRPC Error on ${path}:`, error);
    },
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  console.log('Health check endpoint hit');
  return c.json({ status: "ok", message: "API is running", timestamp: new Date().toISOString() });
});

// Add a test endpoint to verify the API is working
app.get("/test", (c) => {
  console.log('Test endpoint hit');
  return c.json({ message: "Test endpoint working", timestamp: new Date().toISOString() });
});

export default app;