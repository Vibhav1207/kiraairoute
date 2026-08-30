import type { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function registerMiddleware(app: FastifyInstance): Promise<void> {
  await app.register(cors, { origin: true });
}
