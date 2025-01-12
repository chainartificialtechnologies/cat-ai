import { createInterface } from 'readline';
import { InterfacePlugin } from '../../core/plugins/types';
import { v4 as uuidv4 } from 'uuid';

export class CLIInterface implements InterfacePlugin {
  public readonly id: string;
  public readonly name: string = 'CLI Interface';
  public readonly version: string = '1.0.0';
  public readonly type = 'interface' as const;

  private messageCallback?: (message: string) => Promise<void>;
  private rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  constructor() {
    this.id = `cli-${uuidv4()}`;
  }

  public async initialize(): Promise<void> {
    this.rl.on('line', async input => {
      if (this.messageCallback) {
        await this.messageCallback(input);
      }
    });

    console.log('CLI Interface initialized. Type your messages and press Enter.');
  }

  public async cleanup(): Promise<void> {
    this.rl.close();
  }

  public async sendMessage(message: string): Promise<void> {
    console.log(`Agent: ${message}`);
  }

  public onMessage(callback: (message: string) => Promise<void>): void {
    this.messageCallback = callback;
  }
}
