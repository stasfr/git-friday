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
}
