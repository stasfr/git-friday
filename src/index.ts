#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';

import { getAiComletion } from './ai.js';

// --- Конфигурация ---
const GIT_USERS = ['stas_fr', 's.farkash'];
const GIT_BRANCH = 'dev';
// --------------------

const execAsync = promisify(exec);

const main = async () => {
  const cwd = process.cwd();
  console.log(`Ищем коммиты в директории: ${cwd}`);
  console.log(`Авторы: ${GIT_USERS.join(', ')}, Ветка: ${GIT_BRANCH}`);
  console.log('\n---\n');

  const authorArgs = GIT_USERS.map((user) => `--author="${user}"`)
    .join(' ');
  const command = `git log ${GIT_BRANCH} ${authorArgs} --since="00:00:00" --pretty=format:"- %s%n%b"`;

  try {
    const { stdout, stderr } = await execAsync(command, { cwd });

    if (stderr) {
      console.error(`Git stderr: ${stderr}`);

      return;
    }

    if (stdout) {
      const report = await getAiComletion(stdout);
      console.log(report);
    } else {
      console.log('Коммиты за сегодня не найдены.');
    }
  } catch (error: unknown) {
    console.error('Ошибка выполнения git команды');
    console.error(error);
    console.error('Убедитесь, что вы находитесь в git репозитории.');
  }
};

void main();
