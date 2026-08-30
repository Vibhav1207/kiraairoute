import Fastify from "fastify";
import cors from "@fastify/cors";
import { kiraChat, getKiraApiKey } from "./kira.js";
import {
  ResponsesRequest,
  responsesToChat,
  chatToResponses
} from "./protocols/responses.js";
import { getModels } from "./models.js";

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
    data: getModels()
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

app.post("/v1/responses", async (request, reply) => {
  try {
    const responseRequest =
      request.body as ResponsesRequest;

    const chatRequest =
      responsesToChat(responseRequest);

    /*
     * Codex uses stream=true.
     *
     * Kira's upstream Chat Completions endpoint
     * is called normally, then we translate the
     * result into a Responses-compatible SSE stream.
     */
    if (responseRequest.stream === true) {
      const result = await kiraChat({
        ...chatRequest,
        stream: false
      });

      if (result.status >= 400) {
        return reply
          .code(result.status)
          .send(result.data);
      }

      const response = chatToResponses(result.data);

      reply.raw.statusCode = 200;

      reply.raw.setHeader(
        "Content-Type",
        "text/event-stream"
      );

      reply.raw.setHeader(
        "Cache-Control",
        "no-cache, no-transform"
      );

      reply.raw.setHeader(
        "Connection",
        "keep-alive"
      );

      const sendEvent = (
        type: string,
        data: unknown
      ) => {
        const event = {
          ...((data as object) ?? {}),
          type
        };

        reply.raw.write(
          `event: ${type}\n`
        );

        reply.raw.write(
          `data: ${JSON.stringify(event)}\n\n`
        );
      };

      const outputItem = response.output[0];

      if (!outputItem) {
        sendEvent("response.completed", {
          response: {
            ...response,
            status: "completed"
          }
        });

        reply.raw.write(
          "data: [DONE]\n\n"
        );

        reply.raw.end();
        return;
      }

      const contentPart = outputItem.content[0];

      sendEvent("response.created", {
        response: {
          ...response,
          status: "in_progress"
        }
      });

      sendEvent("response.output_item.added", {
        response_id: response.id,
        output_index: 0,
        item: outputItem
      });

      if (contentPart) {
        sendEvent("response.content_part.added", {
          response_id: response.id,
          item_id: outputItem.id,
          output_index: 0,
          content_index: 0,
          part: contentPart
        });

        sendEvent("response.output_text.delta", {
          response_id: response.id,
          item_id: outputItem.id,
          output_index: 0,
          content_index: 0,
          delta: contentPart.text
        });

        sendEvent("response.output_text.done", {
          response_id: response.id,
          item_id: outputItem.id,
          output_index: 0,
          content_index: 0,
          text: contentPart.text
        });

        sendEvent("response.content_part.done", {
          response_id: response.id,
          item_id: outputItem.id,
          output_index: 0,
          content_index: 0,
          part: contentPart
        });
      }

      sendEvent("response.output_item.done", {
        response_id: response.id,
        output_index: 0,
        item: outputItem
      });

      sendEvent("response.completed", {
        response: {
          ...response,
          status: "completed"
        }
      });

      reply.raw.write(
        "data: [DONE]\n\n"
      );

      reply.raw.end();

      return;
    }

    /*
     * Normal non-streaming Responses API request.
     */
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