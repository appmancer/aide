import { LSPClient } from '../LSPClient';

describe('LSPClient', () => {
  test('should create LSPClient instance and track running state', () => {
    const client = new LSPClient();
    expect(client.isRunning()).toBe(false);
  });
});