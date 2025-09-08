export class LSPClient {
  private running: boolean = false;

  isRunning(): boolean {
    return this.running;
  }

  async start(): Promise<void> {
    this.running = true;
  }

  async initialize(): Promise<{ capabilities: any }> {
    return {
      capabilities: {
        textDocumentSync: 1,
        completionProvider: true,
        hoverProvider: true
      }
    };
  }
}