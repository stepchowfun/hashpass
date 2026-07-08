import hashpass from './hashpass.ts';
import type { Request, Response } from './worker-protocol.ts';

self.addEventListener('message', (event: MessageEvent<Request>): void => {
  const request = event.data;

  const response: Response = {
    messageId: request.messageId,
    generatedPassword: hashpass(request.domain, request.universalPassword),
  };

  // oxlint-disable-next-line unicorn/require-post-message-target-origin -- WorkerGlobalScope.postMessage does not take targetOrigin.
  self.postMessage(response);
});
