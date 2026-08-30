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

export async function startServer(customPort?: number): Promise<{ app: FastifyInstance; port: number }> {
  const initialPort = customPort ?? DEFAULT_PORT;
  const maxAttempts = 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const port = initialPort + attempt;
    const app = await createApp();
    try {
      await app.listen({ host: "127.0.0.1", port });
      if (attempt > 0) {
        console.log(`Port ${initialPort} was in use. Automatically started on available port ${port}.`);
      }
      console.log(`KiraAI Route running at http://127.0.0.1:${port}`);
      console.log(`Web setup: http://127.0.0.1:${port}`);
      return { app, port };
    } catch (error: any) {
      await app.close();
      if (error?.code === "EADDRINUSE") {
        continue;
      }
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  console.error(`Could not find an available port after ${maxAttempts} attempts starting from ${initialPort}.`);
  process.exit(1);
}

// Auto-run if executed directly as server entry point
const isDirectEntry = process.argv[1]?.endsWith("server.js") || process.argv[1]?.endsWith("server.ts");
if (isDirectEntry) {
  startServer().catch(() => process.exit(1));
}
