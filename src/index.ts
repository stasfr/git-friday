#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

// --- Конфигурация ---
const GIT_USERS = ['stas_fr', 's.farkash'];
const GIT_BRANCH = 'main';
// --------------------

const execAsync = promisify(exec);

const main = async () => {
  const cwd = process.cwd();
  console.log(`Ищем коммиты в директории: ${cwd}`);
  console.log(`Авторы: ${GIT_USERS.join(', ')}, Ветка: ${GIT_BRANCH}`);
  console.log('\n---\n');

  const authorArgs = GIT_USERS.map(user => `--author="${user}"`).join(' ');
  const command = `git log ${GIT_BRANCH} ${authorArgs} --since="00:00:00" --pretty=format:"- %s%n%b"`;

  try {
    const { stdout, stderr } = await execAsync(command, { cwd });

    if (stderr) {
      console.error(`Git stderr: ${stderr}`);
      return;
    }

    if (stdout) {
      console.log(stdout);
    } else {
      console.log('Коммиты за сегодня не найдены.');
    }
  } catch (error) {
    console.error(`Ошибка выполнения git команды: ${error.message}`);
    console.error('Убедитесь, что вы находитесь в git репозитории.');
  }
};

main();
