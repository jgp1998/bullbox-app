import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

/**
 * WebWorkerMLCEngineHandler is a helper class to handle messages from the main thread.
 * It encapsulates the MLCEngine and provides a simple interface to interact with it.
 */
let handler: WebWorkerMLCEngineHandler;

self.onmessage = (msg: MessageEvent) => {
  if (!handler) {
    handler = new WebWorkerMLCEngineHandler();
  }
  handler.onmessage(msg);
};
