# AI SDK Installation Reference

This file is a **reference** for installing the Vercel AI SDK and common provider packages across different runtimes/frameworks.

--------------------------------

### Install OpenAI Provider Package

Source: https://ai-sdk.dev/docs/getting-started/nodejs

Commands to install the OpenAI provider package using various JavaScript package managers.

```bash
pnpm add @ai-sdk/openai
```

```bash
npm install @ai-sdk/openai
```

```bash
yarn add @ai-sdk/openai
```

```bash
bun add @ai-sdk/openai
```

--------------------------------

### Install AI SDK 5 Beta

Source: https://ai-sdk.dev/llms.txt

Command to install the AI SDK 5 Beta along with example provider and framework packages. Remember to replace placeholders with your specific dependencies.

```bash
# replace with your provider and framework
npm install ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta
```

--------------------------------

### Install Polyfill Dependencies

Source: https://ai-sdk.dev/docs/getting-started/expo

Install the required packages @ungap/structured-clone and @stardazed/streams-text-encoding using your preferred package manager.

```pnpm
pnpm add @ungap/structured-clone @stardazed/streams-text-encoding
```

```npm
npm install @ungap/structured-clone @stardazed/streams-text-encoding
```

```yarn
yarn add @ungap/structured-clone @stardazed/streams-text-encoding
```

```bun
bun add @ungap/structured-clone @stardazed/streams-text-encoding
```

--------------------------------

### Clone and setup AI SDK Slackbot repository

Source: https://ai-sdk.dev/llms.txt

Clone the starter repository and install dependencies using pnpm.

```bash
git clone https://github.com/vercel-labs/ai-sdk-slackbot.git
cd ai-sdk-slackbot
git checkout starter
```

```bash
pnpm install
```

--------------------------------

### Groq Provider Setup

Source: https://ai-sdk.dev/llms.txt

Installation and initialization of the Groq provider for the AI SDK. Covers package installation via multiple package managers and provider instance creation with optional customization.

```APIDOC
## Groq Provider Setup

### Description
The Groq provider is available via the `@ai-sdk/groq` module and provides language model support for the Groq API.

### Installation

Install the Groq provider using your preferred package manager:

```bash
# pnpm
pnpm add @ai-sdk/groq

# npm
npm install @ai-sdk/groq

# yarn
yarn add @ai-sdk/groq

# bun
bun add @ai-sdk/groq
```

### Provider Instance

#### Default Instance

Import the default provider instance:

```typescript
import { groq } from '@ai-sdk/groq';
```

#### Custom Instance

Create a customized provider instance:

```typescript
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  // custom settings
});
```
```

--------------------------------

### Install AI SDK Dependencies

Source: https://ai-sdk.dev/docs/getting-started/nodejs

Install the core AI SDK, zod for schema validation, and dotenv for environment variable management, along with TypeScript development tools.

```bash
pnpm add ai zod dotenv
pnpm add -D @types/node tsx typescript
```

--------------------------------

### Example Skill Instructions for Agent (Markdown)

Source: https://ai-sdk.dev/cookbook/guides/agent-skills

Illustrates the content of a `SKILL.md` file, showing how a skill can instruct the agent to read configuration templates or run setup scripts relative to its directory.

```markdown
Skill directory: /path/to/.agents/skills/my-skill

# My Skill Instructions

Read the configuration template:
templates/config.json

Run the setup script:
bash scripts/setup.sh
```

--------------------------------

### Install AI SDK Dependencies

Source: https://ai-sdk.dev/docs/getting-started/nuxt

Install the core AI SDK, the Vue-specific integration, and Zod for schema validation using your preferred package manager.

```pnpm
pnpm add ai @ai-sdk/vue zod
```

```npm
npm install ai @ai-sdk/vue zod
```

```yarn
yarn add ai @ai-sdk/vue zod
```

```bun
bun add ai @ai-sdk/vue zod
```

--------------------------------

### Provide input examples for tools

Source: https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling

Add inputExamples to guide the model on how to structure data, particularly useful for providers like Anthropic.

```ts
tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  inputExamples: [
    { input: { location: 'San Francisco' } },
    { input: { location: 'London' } },
  ],
  execute: async ({ location }) => {
    // ...
  },
});
```

--------------------------------

### Initialize OpenAI Provider Instance

Source: https://ai-sdk.dev/docs/getting-started/nodejs

Example of importing the OpenAI provider and creating a model instance for a specific GPT model version.

```typescript
import { openai } from '@ai-sdk/openai';

model: openai('gpt-5.1');
```

--------------------------------

### Install Groq Provider Package

Source: https://ai-sdk.dev/llms.txt

Install the `@ai-sdk/groq` package using your preferred package manager.

```shell
pnpm add @ai-sdk/groq
```

```shell
npm install @ai-sdk/groq
```

```shell
yarn add @ai-sdk/groq
```

```shell
bun add @ai-sdk/groq
```

--------------------------------

### Install AI SDK Skill with npx

Source: https://ai-sdk.dev/docs/agents

Install the official AI SDK skill into your coding agent's skills directory using the npx skills CLI. The skill provides specialized instructions for the agent to understand AI SDK usage. Supports multiple agents with symlink creation and non-interactive installation options.

```bash
npx skills add vercel/ai
```

