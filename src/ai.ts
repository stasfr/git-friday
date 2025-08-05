import OpenAI from 'openai';

import { generateReportPrompt } from './prompts.js';

const privateConstructorKey = Symbol('AiWorker.private');

interface AiWorkerProps {
  apiKey: string;
  modelName: string;
}

export class AiWorker {
  #modelName: string;

  #client: OpenAI;

  private constructor(props: AiWorkerProps, key: symbol) {
    if (key !== privateConstructorKey) {
      throw new Error('Private constructor access error');
    }

    this.#client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: props.apiKey,
    });
    this.#modelName = props.modelName;
  }

  static create(props: AiWorkerProps): AiWorker {
    return new AiWorker(props, privateConstructorKey);
  }

  async generateReport(commits: string): Promise<string | null> {
    const prompt = generateReportPrompt(commits);

    const completion = await this.#client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      model: this.#modelName,
    });

    return completion.choices[0].message.content;
  }
}
