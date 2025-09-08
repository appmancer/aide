import { LSPClient } from '../LSPClient';

describe('LSPClient', () => {
  test('should create LSPClient instance and track running state', () => {
    const client = new LSPClient();
    expect(client.isRunning()).toBe(false);
  });

  test('should start TypeScript server process', async () => {
    const client = new LSPClient();
    await client.start();
    expect(client.isRunning()).toBe(true);
  });

  test('should initialize LSP connection', async () => {
    const client = new LSPClient();
    await client.start();
    const result = await client.initialize();
    expect(result).toBeDefined();
    expect(result.capabilities).toBeDefined();
  });
});