import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Event, EventType, EventSubscription } from './types';

export class EventBus extends EventEmitter {
  private static instance: EventBus;
  private subscriptions: Map<string, EventSubscription> = new Map();
  private eventHistory: Event[] = [];
  private readonly maxHistorySize = 1000;

  private constructor() {
    super();
    this.setupEventHandling();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  private setupEventHandling(): void {
    this.on('event', this.handleEvent.bind(this));
  }

  private async handleEvent(event: Event): Promise<void> {
    // Store event in history
    this.eventHistory.unshift(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.pop();
    }

    // Process subscriptions
    const promises = Array.from(this.subscriptions.values())
      .filter(sub => sub.type === event.type)
      .filter(sub => !sub.filter || sub.filter(event))
      .map(sub => this.processSubscription(sub, event));

    await Promise.all(promises);
  }

  private async processSubscription(subscription: EventSubscription, event: Event): Promise<void> {
    try {
      await subscription.handler(event);
    } catch (error) {
      this.emit('error', {
        id: uuidv4(),
        type: 'error',
        timestamp: new Date(),
        source: 'EventBus',
        data: {
          error,
          subscription,
          event,
        },
      });
    }
  }

  public publish<T>(
    type: EventType,
    source: string,
    data: T,
    metadata?: Record<string, unknown>
  ): void {
    const event: Event<T> = {
      id: uuidv4(),
      type,
      timestamp: new Date(),
      source,
      data,
      metadata,
    };

    this.emit('event', event);
  }

  public subscribe(
    type: EventType,
    handler: (event: Event) => Promise<void>,
    filter?: (event: Event) => boolean
  ): string {
    const id = uuidv4();
    this.subscriptions.set(id, {
      id,
      type,
      handler,
      filter,
    });
    return id;
  }

  public unsubscribe(subscriptionId: string): boolean {
    return this.subscriptions.delete(subscriptionId);
  }

  public getEventHistory(type?: EventType, limit = 100): Event[] {
    let events = this.eventHistory;
    if (type) {
      events = events.filter(event => event.type === type);
    }
    return events.slice(0, limit);
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}
