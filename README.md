# CAT-AI

[English](README.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md)

🐈 A next-generation, modular AI agent framework for building autonomous systems that seamlessly interact across multiple platforms.

## 
CAT-AI empowers developers to create intelligent, autonomous agents that break free from traditional chatbot limitations. By combining the power of large language models with crypto-native capabilities, CAT-AI enables a new breed of AI agents that can:

## 
```
  ,-.       _,---._ __  / \
 /  |    .-'       `./ /   \
|  /   ,'            `/    /|
 \  `-"             \'\   / |
  `.              ,  \ \ /  |
   /`.          ,'-`----Y   |
  |            ;        |   '
  |  ,-.    ,-'         |  /
  |  | (   |    C.A.T.  | /
  )  |  \  `.___________|/
  `--'   `--'
```

- 🌐 **True Multi-Modal Interaction**: Your agent lives wherever your users are - Twitter, Bluesky, Farcaster, CLI, or custom interfaces
- 🧠 **Flexible Intelligence**: Plug in any AI provider (OpenAI, Anthropic, Ollama) and switch between them seamlessly
- 🤖 **Execute Autonomous Trading Strategies** with configurable parameters, and reliable and accurate data
- 🔄 **Event-Driven Architecture**: React to market conditions, user messages, or system events in real-time
- 🛡️ **Security-First Design**: Built with best practices for handling sensitive operations and user data
- 🔌 **Plugin System**: Extend functionality without touching the core - add new interfaces, actions, or tools

## Features

- 🤖 **Modular Agent System**: Build and customize agents with plug-and-play components
- 🐈 **meowNet**: Get real-time crypto signals and trading data

## MeowNet 

meowNet powers our agents with real-time crypto signals and trading data, to allow them to be more autonomous decisions and learn from the market. 

## 📚 Documentation

- Getting Started
  - [Quickstart](docs/Quickstart.md) | [Español](docs/es/Quickstart.md) | [中文](docs/zh/Quickstart.md)
  - [Introduction](docs/Introduction.md) | [Español](docs/es/Introduction.md) | [中文](docs/zh/Introduction.md)
  - [FAQ](docs/FAQ.md) | [Español](docs/es/FAQ.md) | [中文](docs/zh/FAQ.md)
  - [Contributing](docs/Contributing.md) | [Español](docs/es/Contributing.md) | [中文](docs/zh/Contributing.md)

## Architecture

Were building a modular framework with modularity and extensibility at its core:

```
cat-ai/
├── src/
│   ├── core/           # Core agent framework
│   │   ├── agent/      # Agent state and lifecycle management
│   │   ├── config/     # Configuration system
│   │   ├── events/     # Event bus and handling
│   │   └── plugins/    # Plugin system
│   ├── interfaces/     # Communication interfaces
│   │   ├── social/     # Social media platforms
│   │   ├── cli/        # Command line interface
│   │   └── api/        # REST/WebSocket API
│   ├── ai/             # AI provider integrations
│   ├── actions/        # Action modules
│   │   ├── crypto/     # Crypto trading and wallet management
│   │   └── custom/     # Custom action modules
│   └── storage/        # State and memory management
```

## Installation

```bash
# Note: Package name is tentative and not yet published
npm install @chainartificialtechnologies/cat-ai
# or
yarn add @chainartificialtechnologies/cat-ai
```

## Quick Start

```typescript
import { Agent, OpenAIProvider, TwitterInterface } from '@chainartificialtechnologies/cat-ai';

// Create and configure an agent
const agent = new Agent({
  ai: new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
  }),
  interfaces: [
    new TwitterInterface({
      // Twitter credentials
    }),
  ],
});

// Start the agent
agent.start();
```

## Contributing

We're building the future of autonomous AI agents, and we'd love your help! Here are some areas where you can contribute:

- 🔌 **New Interfaces**: Add support for more platforms (Discord, Telegram, etc.)
- 🧠 **AI Providers**: Integrate more models and providers, we want to support anything you're building on
- 📈🐈 **DeFi Actions**: Contribute to MeowNet making our agents more autonomous and better traders
- 🔧 **Core Improvements**: Enhance the framework's capabilities
- 📚 **Documentation**: Help others build amazing agents

Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## Development Setup

1. Clone the repository

```bash
git clone https://github.com/chainartificialtechnologies/cat-ai.git
cd cat-ai
```

2. Install dependencies

```bash
npm install
```

3. Build the project

```bash
npm run build
```

4. Run tests

```bash
npm test
```

## License

MIT Licensed

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=chainartificialtechnologies/cat-ai&type=Date)](https://star-history.com/#chainartificialtechnologies/cat-ai&Date)
