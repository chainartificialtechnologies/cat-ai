import { Agent } from '../src/core/agent/Agent';
import { PluginManager } from '../src/core/plugins/PluginManager';
import { CLIInterface } from '../src/interfaces/cli/CLIInterface';
import { OpenAIProvider } from '../src/ai/openai/OpenAIProvider';

async function main() {
  // Create plugin manager
  const pluginManager = new PluginManager();

  // Initialize plugins
  const cliInterface = new CLIInterface();
  const openaiProvider = new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || '',
  });

  // Register plugins
  await pluginManager.registerPlugin(cliInterface);
  await pluginManager.registerPlugin(openaiProvider);

  // Create agent configuration
  const config = {
    name: 'BasicAgent',
    aiProvider: openaiProvider.id,
    interfaces: [cliInterface.id],
    actions: [],
  };

  // Create and start agent
  const agent = new Agent(config);
  
  try {
    await agent.start();
    console.log('Agent started successfully!');
    
    // The agent will run until interrupted
    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await agent.stop();
      await pluginManager.cleanup();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start agent:', error);
    process.exit(1);
  }
}

main().catch(console.error); 