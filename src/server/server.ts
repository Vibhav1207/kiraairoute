import Fastify, { FastifyInstance } from "fastify";
import { DEFAULT_PORT } from "../config/constants.js";
import { registerMiddleware } from "./middleware.js";
import { registerRoutes } from "./routes.js";

export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });
  await registerMiddleware(app);
  await registerRoutes(app);
  return app;
}

export async function startServer(customPort?: number): Promise<FastifyInstance> {
  const app = await createApp();
  const port = customPort ?? DEFAULT_PORT;

  try {
    await app.listen({ host: "127.0.0.1", port });
    console.log(`KiraAI Route running at http://127.0.0.1:${port}`);
    console.log(`Web setup: http://127.0.0.1:${port}`);
    return app;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Auto-run if executed directly as server entry point
const isDirectEntry = process.argv[1]?.endsWith("server.js") || process.argv[1]?.endsWith("server.ts");
if (isDirectEntry) {
  startServer().catch(() => process.exit(1));
}
