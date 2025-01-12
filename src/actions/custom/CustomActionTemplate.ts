import { ActionPlugin, ActionResult, ActionCapability } from '../../core/plugins/types';
import { v4 as uuidv4 } from 'uuid';
import { EventBus } from '../../core/events/EventBus';

/**
 * Configuration interface for your custom action.
 * Define all the configuration options your action needs.
 */
export interface CustomActionConfig {
  // Add your configuration options here
  enabled: boolean;
  options?: Record<string, unknown>;
}

/**
 * Template for creating custom actions.
 * Rename the class and implement your own functionality.
 */
export class CustomActionTemplate implements ActionPlugin {
  public readonly id: string;
  public readonly name: string = 'Custom Action Template';
  public readonly version: string = '1.0.0';
  public readonly type = 'action' as const;

  private config: CustomActionConfig;
  private eventBus: EventBus;

  constructor(config: CustomActionConfig) {
    this.id = `custom-${uuidv4()}`;
    this.config = config;
    this.eventBus = EventBus.getInstance();
  }

  public async initialize(): Promise<void> {
    // Initialize your action here
    // - Set up connections
    // - Load required resources
    // - Validate configuration
    if (!this.config.enabled) {
      console.log('Custom action is disabled');
      return;
    }

    console.log('Initializing custom action...');
  }

  public async cleanup(): Promise<void> {
    // Clean up resources here
    // - Close connections
    // - Save state
    // - Release resources
    console.log('Cleaning up custom action...');
  }

  public async execute(params: Record<string, unknown>): Promise<ActionResult> {
    // Implement your action's main functionality here
    // 1. Validate parameters
    // 2. Perform the action
    // 3. Return results

    try {
      // Example implementation
      console.log('Executing custom action with params:', params);

      // Publish an event about the action
      this.eventBus.publish('action', this.id, {
        actionId: this.id,
        status: 'completed',
        params,
        result: { message: 'Custom action executed successfully' },
      });

      return {
        success: true,
        data: {
          message: 'Custom action executed successfully',
          params,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Custom action failed: ${error}`,
      };
    }
  }

  public getCapabilities(): ActionCapability[] {
    // Define the capabilities of your action
    // This helps the agent understand what your action can do
    return [
      {
        name: 'customAction',
        description: 'Description of what your custom action does',
        parameters: {
          // Define the parameters your action accepts
          param1: {
            type: 'string',
            description: 'Description of param1',
            required: true,
          },
          param2: {
            type: 'number',
            description: 'Description of param2',
            required: false,
          },
        },
      },
    ];
  }
}
