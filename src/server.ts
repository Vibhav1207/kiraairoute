import Fastify from "fastify";
import cors from "@fastify/cors";
import net from "node:net";

import { kiraChat, getKiraApiKey } from "./kira.js";

import {
  ResponsesRequest,
  responsesToChat,
  chatToResponses
} from "./protocols/responses.js";

import { getModels, isSupportedModel } from "./models.js";

const app = Fastify({
  logger: false
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
    data: getModels()
  };
});

app.post("/v1/chat/completions", async (request, reply) => {
  try {
    const body = request.body as {
      model?: string;
    };

    if (!body?.model) {
      return reply.code(400).send({
        error: {
          message: "Missing required field: model",
          type: "invalid_request_error",
          param: "model"
        }
      });
    }

    if (!isSupportedModel(body.model)) {
      return reply.code(400).send({
        error: {
          message: `Unsupported model: ${body.model}`,
          type: "invalid_request_error",
          param: "model"
        }
      });
    }

    const result = await kiraChat(request.body);

    return reply
      .code(result.status)
      .send(result.data);
  } catch (error) {
    console.error("Chat completion error:", error);

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

app.post("/v1/responses", async (request, reply) => {
  try {
    const responseRequest =
      request.body as ResponsesRequest;

    const chatRequest =
      responsesToChat(responseRequest);

    const model = (chatRequest as {
      model?: string;
    }).model;

    if (!model) {
      return reply.code(400).send({
        error: {
          message: "Missing required field: model",
          type: "invalid_request_error",
          param: "model"
        }
      });
    }

    if (!isSupportedModel(model)) {
      return reply.code(400).send({
        error: {
          message: `Unsupported model: ${model}`,
          type: "invalid_request_error",
          param: "model"
        }
      });
    }

    const result = await kiraChat(chatRequest);

    if (result.status >= 400) {
      return reply
        .code(result.status)
        .send(result.data);
    }

    const responsesResult =
      chatToResponses(result.data);

    return reply.send(responsesResult);
  } catch (error) {
    console.error("Responses API error:", error);

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

async function findAvailablePort(
  startPort: number
): Promise<number> {
  for (
    let port = startPort;
    port <= startPort + 20;
    port++
  ) {
    try {
      await new Promise<void>((resolve, reject) => {
        const server = net.createServer();

        server.once("error", reject);

        server.once("listening", () => {
          server.close(() => resolve());
        });

        server.listen(port, "127.0.0.1");
      });

      return port;
    } catch {
      // Try next port.
    }
  }

  throw new Error(
    `No available port found between ${startPort} and ${
      startPort + 20
    }.`
  );
}

async function start() {
  try {
    getKiraApiKey();

    const requestedPort = Number(
      process.env.KIRAAIROUTE_PORT || 4010
    );

    const port = await findAvailablePort(requestedPort);

    if (port !== requestedPort) {
      console.log(
        `Port ${requestedPort} is busy. Using port ${port} instead.`
      );
    }

    await app.listen({
      host: "127.0.0.1",
      port
    });

    console.log("");
    console.log("KiraAI Route is running");
    console.log("");
    console.log(`API:    http://127.0.0.1:${port}/v1`);
    console.log(
      `Models: http://127.0.0.1:${port}/v1/models`
    );
    console.log("");
    console.log("Press Ctrl+C to stop.");
  } catch (error) {
    console.error("KiraAI Route error:", error);
    process.exit(1);
  }
}

await start();