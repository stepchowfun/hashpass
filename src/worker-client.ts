import type { Request, Response } from './worker-protocol';

// Spawn a web worker for offloading password generation to a dedicated thread.
const worker = new Worker('dist/worker.bundle.js');

// Each message has a unique auto-incrementing identifier.
let nextMessageId = 0;

// Keep track of all in-flight requests so we know what to do with the corresponding responses.
const requests = new Map<number, (generatedPassword: string) => void>();

// This is the handler for incoming responses.
worker.onmessage = (event: MessageEvent<Response>): void => {
  const requestHandler = requests.get(event.data.messageId);

  if (requestHandler !== undefined) {
    requestHandler(event.data.generatedPassword);
    requests.delete(event.data.messageId);
  }
};

export default function hashpass(
  domain: string,
  universalPassword: string,
): Promise<string> {
  return new Promise((resolve) => {
    const request: Request = {
      messageId: nextMessageId,
      domain,
      universalPassword,
    };

    requests.set(nextMessageId, resolve);

    worker.postMessage(request);

    nextMessageId = (nextMessageId + 1) % Number.MAX_SAFE_INTEGER;
  });
}
