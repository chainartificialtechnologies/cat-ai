import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { AgentConfig, AgentState, AgentStatus, Message, ConversationHistory } from './types';

export class Agent extends EventEmitter {
  private state: AgentState;
  private config: AgentConfig;
  private interfaces: Map<string, any> = new Map();
  private actions: Map<string, any> = new Map();

  constructor(config: AgentConfig) {
    super();
    this.config = config;
    this.state = this.initializeState();
  }

  private initializeState(): AgentState {
    return {
      id: uuidv4(),
      name: this.config.name || `Agent-${uuidv4().slice(0, 8)}`,
      status: 'initializing',
      lastActive: new Date(),
      memory: {
        conversations: [],
        actions: [],
        state: {},
      },
    };
  }

  public async start(): Promise<void> {
    try {
      await this.loadInterfaces();
      await this.loadActions();
      this.setState('ready');
      this.emit('started');
    } catch (error) {
      this.setState('error');
      throw error;
    }
  }

  public async stop(): Promise<void> {
    this.setState('stopped');
    this.emit('stopped');
  }

  private setState(status: AgentStatus): void {
    this.state.status = status;
    this.state.lastActive = new Date();
    this.emit('stateChanged', this.state);
  }

  public async handleMessage(message: Message): Promise<void> {
    if (this.state.status !== 'ready') {
      throw new Error('Agent is not ready to handle messages');
    }

    this.setState('busy');
    try {
      // Process message through AI provider
      const response = await this.processMessage(message);

      // Update conversation history
      this.updateConversationHistory(message, response);

      // Send response through the appropriate interface
      if (
        message.metadata?.interface &&
        this.interfaces.has(message.metadata.interface as string)
      ) {
        const interfacePlugin = this.interfaces.get(message.metadata.interface as string);
        await interfacePlugin.sendMessage(response.content);
      }

      this.setState('ready');
    } catch (error) {
      this.setState('error');
      throw error;
    }
  }

  private async processMessage(message: Message): Promise<Message> {
    // TODO: Implement AI provider integration
    return {
      id: uuidv4(),
      role: 'agent',
      content: 'Message processing not implemented yet.',
      timestamp: new Date(),
      metadata: message.metadata,
    };
  }

  private updateConversationHistory(message: Message, response: Message): void {
    const conversation: ConversationHistory = {
      id: uuidv4(),
      interface: (message.metadata?.interface as string) || 'unknown',
      timestamp: new Date(),
      messages: [message, response],
    };

    this.state.memory.conversations.push(conversation);
  }

  private async loadInterfaces(): Promise<void> {
    for (const interfaceId of this.config.interfaces) {
      // TODO: Load interface plugins
      this.interfaces.set(interfaceId, null);
    }
  }

  private async loadActions(): Promise<void> {
    for (const actionId of this.config.actions) {
      // TODO: Load action plugins
      this.actions.set(actionId, null);
    }
  }

  public getState(): AgentState {
    return { ...this.state };
  }
}
