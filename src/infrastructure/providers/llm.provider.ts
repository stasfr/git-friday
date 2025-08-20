import type { ILlmProvider, ICompletionResult } from '@/domain/services/llm-provider.interface.js';

import OpenAI from 'openai';

interface LlmProviderDependencies { openRouterApiKey: string; }

export class LlmProvider implements ILlmProvider {
  private readonly client: OpenAI;

  public constructor(dependencies: LlmProviderDependencies) {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: dependencies.openRouterApiKey,
    });
  }

  private generateSystemPromptForReport(): string {
    return `
      # Роль:
      Ты — AI-ассистент тимлида, специализирующийся на анализе логов git и составлении отчетов о проделанной работе. Ты преобразуешь технические списки коммитов в понятные для менеджмента отчеты.

      # Задача:
      Твоя главная цель — группировать связанные коммиты в единые, содержательные пункты. Каждый пункт должен описывать реализованную функциональность, улучшение или исправление с точки зрения ценности для продукта или кодовой базы.

      # Правила и ограничения:
      1.  **Формат пункта:** Каждый пункт должен начинаться со строчной (маленькой) буквы и обязательно заканчиваться точкой с запятой (;).
      2.  **Стиль:** Используй глаголы совершенного вида в прошедшем времени (например: реализован, добавлен, исправлена, оптимизирована, проведен рефакторинг).
      3.  **Фильтрация:** Игнорируй неинформативные коммиты, такие как слияние веток (merge), исправление опечаток (typo), обновление зависимостей (chore, deps), если они не несут значимой информации о задаче.
      4.  **Точность:** Основывай отчет ИСКЛЮЧИТЕЛЬНО на информации из предоставленных коммитов. Не додумывай и не добавляй ничего от себя.
      5.  **Вывод:** Результат должен быть только списком пунктов. Без заголовков, вступлений или заключений.

      # Пример идеального результата:
      реализован новый виджет "Задачи" с интерфейсом на вкладках для объединения и мониторинга задач из различных систем;
      реализована возможность прикрепления файлов в диалогах сервисных заявок путем вставки из буфера обмена (Ctrl+V);
      добавлены анимации наведения для кнопок для улучшения визуального отклика и пользовательского опыта;
      проведен рефакторинг системы управления правами доступа для повышения ее надежности и упрощения дальнейшей поддержки;
    `;
  }

  private generateUserPromptForReport(commits: string): string {
    return `
      Проанализируй следующие коммиты и сгенерируй отчет, строго следуя правилам и формату, заданным в твоих инструкциях.

      Коммиты для анализа:
      ${commits}
    `;
  }

  public async getReportBody(commits: string, modelName: string): Promise<ICompletionResult | null> {
    const systemPrompt = this.generateSystemPromptForReport();
    const userPrompt = this.generateUserPromptForReport(commits);

    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: modelName,
    });

    if (!completion.choices[0].message.content) {
      return null;
    }

    const completionResult: ICompletionResult = {
      content: completion.choices[0].message.content,
      promptTokens: completion.usage?.prompt_tokens ?? 0,
      completionTokens: completion.usage?.completion_tokens ?? 0,
    };

    return completionResult;
  }

  private generateSystemPromptForPullRequest(): string {
    return `
      # Role:
      You are an expert AI assistant specializing in analyzing git commit logs to generate high-quality pull request descriptions. You transform raw commit lists into clear, well-structured Markdown summaries for engineering teams.

      # Task:
      Your primary goal is to create a comprehensive pull request description in Markdown format. This includes a concise, descriptive title and a body that summarizes the changes. The body should group related commits into meaningful bullet points, explaining the value of each change.

      # Rules and Constraints:
      1.  **Output Format:** The entire output must be valid Markdown.
      2.  **Structure:** The output must contain two parts:
          *   A title, prefixed with \`TITLE:\`.
          *   A body, prefixed with \`BODY:\`.
      3.  **Title Generation:**
          *   The title should be a single, concise line summarizing the core purpose of the pull request.
          *   It should follow the Conventional Commits specification (e.g., \`feat: Add user authentication\`, \`fix: Correct login page rendering\`).
      4.  **Body Generation:**
          *   The body should start with a brief overview of the changes.
          *   Group related commits into a bulleted list under a "Changes" section (
          *   Each bullet point should describe a feature, fix, or improvement in a clear, user-centric way.
          *   Use past tense verbs (e.g., "Added," "Fixed," "Refactored").
      5.  **Content Filtering:** Ignore non-informative commits like merges, typo fixes, or dependency updates (e.g., \`chore(deps)\`), unless they are directly relevant to a significant change.
      6.  **Accuracy:** Base the description ONLY on the information from the provided commits. Do not add any information that cannot be inferred from the logs.
      7.  **Language:** The output must be in English.

      # Ideal Output Example:

      TITLE: feat(auth): Implement password reset functionality

      BODY:
      This pull request introduces a secure password reset feature for users. It includes the necessary API endpoints, sends a password reset email to the user, and provides a form to set a new password.

      ### Changes
      - Added a new API endpoint (\`/api/auth/reset-password\`) to handle password reset requests.
      - Implemented an email service to send password reset links to users.
      - Created a new page with a form for users to enter and confirm their new password.
      - Refactored the authentication service to include the new password reset logic.
    `;
  }

  private generateUserPromptForPullRequest(commits: string): string {
    return `
      Analyze the following commits and generate a pull request title and body in Markdown format, strictly following the rules and format specified in your instructions.

      Commits for analysis:
      ${commits}
    `;
  }

  public async getPullRequestCompletion(commits: string, modelName: string): Promise<ICompletionResult | null> {
    const systemPrompt = this.generateSystemPromptForPullRequest();
    const userPrompt = this.generateUserPromptForPullRequest(commits);

    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: modelName,
    });

    if (!completion.choices[0].message.content) {
      return null;
    }

    const completionResult: ICompletionResult = {
      content: completion.choices[0].message.content,
      promptTokens: completion.usage?.prompt_tokens ?? 0,
      completionTokens: completion.usage?.completion_tokens ?? 0,
    };

    return completionResult;
  }
}
