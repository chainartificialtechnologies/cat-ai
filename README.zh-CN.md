# CAT-AI

[English](README.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md)

🤖 一个新一代的模块化 AI 代理框架，用于构建可以跨多个平台无缝交互的自主系统。

## 愿景

CAT-AI 使开发者能够创建突破传统聊天机器人限制的智能自主代理。通过将大型语言模型的能力与加密原生功能相结合，CAT-AI 能够实现新一代的 AI 代理，它们可以：

- 🌐 **自主运行** 跨多个平台和协议
- 💹 **执行复杂的交易策略** 具有可配置的风险参数
- 🔐 **安全高效地管理数字资产**
- 🤝 **通过用户首选的通信渠道进行互动**
- 🧩 **通过模块化插件架构学习和适应**

## 为什么选择 CAT-AI？

AI 的未来不仅仅是聊天界面 - 而是能够代表用户理解、决策和行动的自主代理。CAT-AI 为构建这些下一代代理提供了基础：

- 🎯 **真正的多模态交互**：您的代理存在于用户所在的任何地方 - Twitter、Bluesky、Farcaster、CLI 或自定义界面
- 🧠 **灵活的智能**：插入任何 AI 提供商（OpenAI、Anthropic、Ollama）并在它们之间无缝切换
- 🔄 **事件驱动架构**：实时响应市场条件、用户消息或系统事件
- 🛡️ **安全优先设计**：采用处理敏感操作和用户数据的最佳实践
- 🔌 **插件系统**：无需触及核心即可扩展功能 - 添加新的接口、操作或 AI 功能

## 特性

- 🤖 **模块化代理系统**：使用即插即用组件构建和自定义代理
- 🔌 **多个 AI 提供商**：支持 OpenAI、Anthropic、Ollama 等
- 💬 **多平台接口**：通过 Twitter、Bluesky、Farcaster、CLI 和自定义接口进行交互
- 💰 **加密集成**：内置钱包管理和交易支持
- 🔧 **可扩展架构**：易于添加新功能和集成
- 🔒 **安全设计**：采用处理敏感操作的安全最佳实践

## 架构

该框架的设计以模块化和可扩展性为核心：

```
cat-ai/
├── src/
│   ├── core/           # 核心代理框架
│   │   ├── agent/      # 代理状态和生命周期管理
│   │   ├── config/     # 配置系统
│   │   ├── events/     # 事件总线和处理
│   │   └── plugins/    # 插件系统
│   ├── interfaces/     # 通信接口
│   │   ├── social/     # 社交媒体平台
│   │   ├── cli/        # 命令行接口
│   │   └── api/        # REST/WebSocket API
│   ├── ai/             # AI 提供商集成
│   ├── actions/        # 操作模块
│   │   ├── crypto/     # 加密货币交易和钱包管理
│   │   └── custom/     # 自定义操作模块
│   └── storage/        # 状态和内存管理
```

## 安装

```bash
# 注意：包名暂定，尚未发布
npm install @chainartificialtechnologies/cat-ai
# 或
yarn add @chainartificialtechnologies/cat-ai
```

## 快速开始

```typescript
import { Agent, OpenAIProvider, TwitterInterface } from '@chainartificialtechnologies/cat-ai';

// 创建并配置代理
const agent = new Agent({
  ai: new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
  }),
  interfaces: [
    new TwitterInterface({
      // Twitter 凭证
    }),
  ],
});

// 启动代理
agent.start();
```

## 贡献

我们正在构建自主 AI 代理的未来，我们很期待您的帮助！以下是一些您可以贡献的领域：

- 🔌 **新接口**：添加更多平台支持（Discord、Telegram、Matrix 等）
- 🧠 **AI 提供商**：集成更多 AI 模型和提供商
- 💰 **DeFi 操作**：实现新的交易策略和 DeFi 交互
- 🔧 **核心改进**：增强框架功能
- 📚 **文档**：帮助他人构建出色的代理

更多详情请参阅我们的[贡献指南](CONTRIBUTING.md)。

## 开发设置

1. 克隆仓库

```bash
git clone https://github.com/chainartificialtechnologies/cat-ai.git
cd cat-ai
```

2. 安装依赖

```bash
npm install
```

3. 构建项目

```bash
npm run build
```

4. 运行测试

```bash
npm test
```

## 许可证

MIT 许可

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=chainartificialtechnologies/cat-ai&type=Date)](https://star-history.com/#chainartificialtechnologies/cat-ai&Date) 