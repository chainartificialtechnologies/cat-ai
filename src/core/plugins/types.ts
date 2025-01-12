export interface Plugin {
  id: string;
  name: string;
  version: string;
  type: PluginType;
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
}

export type PluginType = 'ai' | 'interface' | 'action' | 'storage';

export interface AIPlugin extends Plugin {
  type: 'ai';
  processMessage: (message: string, context: AIContext) => Promise<string>;
}

export interface InterfacePlugin extends Plugin {
  type: 'interface';
  sendMessage: (message: string) => Promise<void>;
  onMessage: (callback: (message: string) => Promise<void>) => void;
}

export interface ActionPlugin extends Plugin {
  type: 'action';
  execute: (params: Record<string, unknown>) => Promise<ActionResult>;
  getCapabilities: () => ActionCapability[];
}

export interface StoragePlugin extends Plugin {
  type: 'storage';
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

export interface AIContext {
  conversationId: string;
  messageHistory: Array<{
    role: 'user' | 'agent' | 'system';
    content: string;
  }>;
  agentState: Record<string, unknown>;
}

export interface ActionResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface ActionCapability {
  name: string;
  description: string;
  parameters: {
    [key: string]: {
      type: string;
      description: string;
      required: boolean;
    };
  };
}
