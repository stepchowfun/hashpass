import hashpass from "./hashpass.ts";
import type { Request, Response } from "./worker-protocol.ts";

self.onmessage = (event: MessageEvent<Request>) => {
  const request = event.data;

  const response: Response = {
    messageId: request.messageId,
    generatedPassword: hashpass(request.domain, request.universalPassword),
  };

  self.postMessage(response);
};
