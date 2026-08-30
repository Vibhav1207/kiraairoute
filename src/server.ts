import Fastify from "fastify";
import cors from "@fastify/cors";
import { kiraChat, getKiraApiKey } from "./kira.js";

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: true
});

app.get("/", async () => {
  return {
    name: "KiraAI Route",
    version: "0.1.0",
    status: "running"
  };
});

app.get("/v1/models", async () => {
  return {
    object: "list",
    data: [
      {
        id: "kira-mini-1.0",
        object: "model",
        owned_by: "kira"
      }
    ]
  };
});

app.post("/v1/chat/completions", async (request, reply) => {
  try {
    const result = await kiraChat(request.body);

    return reply
      .code(result.status)
      .send(result.data);
  } catch (error) {
    return reply.code(500).send({
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Unknown error"
      }
    });
  }
});

const port = Number(
  process.env.KIRAAIROUTE_PORT || 4010
);

try {
  getKiraApiKey();

  await app.listen({
    host: "127.0.0.1",
    port
  });

  console.log(
    `KiraAI Route running at http://127.0.0.1:${port}`
  );
} catch (error) {
  app.log.error(error);
  process.exit(1);
}