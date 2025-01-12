export interface AgentConfig {
  name?: string;
  aiProvider: string;
  interfaces: string[];
  actions: string[];
  storage?: StorageConfig;
}

export interface StorageConfig {
  type: 'memory' | 'file' | 'redis' | string;
  options?: Record<string, unknown>;
}

export interface AgentState {
  id: string;
  name: string;
  status: AgentStatus;
  lastActive: Date;
  memory: AgentMemory;
}

export interface AgentMemory {
  conversations: ConversationHistory[];
  actions: ActionHistory[];
  state: Record<string, unknown>;
}

export interface ConversationHistory {
  id: string;
  interface: string;
  timestamp: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ActionHistory {
  id: string;
  type: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
  data: Record<string, unknown>;
}

export type AgentStatus = 'initializing' | 'ready' | 'busy' | 'error' | 'stopped';
