import { APIServer } from './server';

async function main() {
  const server = new APIServer();
  
  try {
    await server.initialize();
    await server.start();

    // Handle graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'] as const;
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`Received ${signal}, shutting down...`);
        try {
          await server.stop();
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 