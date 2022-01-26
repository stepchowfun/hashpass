import type { Request, Response } from './worker-protocol';

// Spawn a web worker for offloading password generation to a dedicated thread.
const worker = new Worker('/dist/worker.bundle.js');

// Each message has a unique auto-incrementing identifier.
let nextMessageId = 0;

// Keep track of all in-flight requests so we know what to do with the corresponding responses.
let hashpassRequests: Record<number, (generatedPassword: string) => void> = {};

// Keep track of all in-flight requests to flush so we can return control back to those callers.
let flushRequests: (() => void)[] = [];

// This is the handler for incoming responses.
worker.onmessage = (event: MessageEvent<Response>) => {
  hashpassRequests[event.data.messageId](event.data.generatedPassword);
  delete hashpassRequests[event.data.messageId];

  if (Object.keys(hashpassRequests).length === 0) {
    for (let flushRequest of flushRequests) {
      flushRequest();
    }

    flushRequests = [];
  }
};

export function hashpass(
  domain: string,
  universalPassword: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let request: Request = {
      messageId: nextMessageId,
      domain,
      universalPassword,
    };

    hashpassRequests[nextMessageId] = resolve;

    worker.postMessage(request);

    nextMessageId = (nextMessageId + 1) % Number.MAX_SAFE_INTEGER;
  });
}

export function flush(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (Object.keys(hashpassRequests).length === 0) {
      resolve();
    } else {
      flushRequests.push(resolve);
    }
  });
}
