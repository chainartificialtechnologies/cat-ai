# Custom Actions

This directory is for community-contributed actions that extend the agent's capabilities. Custom actions can be anything from integrating with new services to implementing complex business logic.

## Creating a Custom Action

1. Copy the `CustomActionTemplate.ts` file and rename it to your action name (e.g., `MyAwesomeAction.ts`)
2. Implement your action by following the template's structure
3. Make sure to:
   - Define a clear configuration interface
   - Implement proper initialization and cleanup
   - Handle errors gracefully
   - Emit appropriate events
   - Document capabilities and parameters

## Example Custom Actions Ideas

- Social Media Analytics
- Market Data Aggregation
- DeFi Protocol Integration
- NFT Trading Strategies
- Cross-Chain Bridge Operations
- Custom Trading Indicators
- Risk Management Rules
- Portfolio Rebalancing
- Sentiment Analysis
- Price Alerts

## Best Practices

1. **Configuration**
   - Make your action configurable
   - Validate configuration in initialize()
   - Use sensible defaults

2. **Error Handling**
   - Catch and handle all errors
   - Provide meaningful error messages
   - Clean up resources on failure

3. **Events**
   - Emit events for important state changes
   - Include relevant data in events
   - Use appropriate event types

4. **Security**
   - Validate all inputs
   - Handle sensitive data carefully
   - Implement rate limiting if needed

5. **Documentation**
   - Document all configuration options
   - Provide clear parameter descriptions
   - Include usage examples

## Example Implementation

```typescript
import { ActionPlugin, ActionResult } from '../../core/plugins/types';

export interface MyActionConfig {
  apiKey: string;
  threshold: number;
  enabled: boolean;
}

export class MyAction implements ActionPlugin {
  // ... implementation following the template
}
```

## Testing Your Action

1. Create unit tests in the `__tests__` directory
2. Test error cases and edge conditions
3. Verify event emissions
4. Test cleanup and resource management

## Contributing

1. Fork the repository
2. Create your action in this directory
3. Add tests and documentation
4. Submit a pull request

For more information, see the main [Contributing Guide](../../../../CONTRIBUTING.md). 