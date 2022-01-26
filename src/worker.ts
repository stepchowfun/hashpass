import hashpass from './hashpass';
import type { Request, Response } from './worker-protocol';

self.onmessage = (event) => {
  let request: Request = event.data;

  let response: Response = {
    messageId: request.messageId,
    generatedPassword: hashpass(request.domain, request.universalPassword),
  };

  self.postMessage(response);
};
