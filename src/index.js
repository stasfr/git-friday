#!/usr/bin/env node

const { exec } = require('child_process');

// --- Конфигурация ---
const GIT_USER = 'stas_fr';
const GIT_BRANCH = 'dev';
// --------------------

const main = () => {
  const cwd = process.cwd();
  console.log(`Ищем коммиты в директории: ${cwd}`);
  console.log(`Автор: ${GIT_USER}, Ветка: ${GIT_BRANCH}`);
  console.log('---');

  const command = `git log ${GIT_BRANCH} --author="${GIT_USER}" --since="00:00:00" --pretty=format:"- %s"`;

  exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка выполнения git команды: ${error.message}`);
      console.error('Убедитесь, что вы находитесь в git репозитории.');
      return;
    }
    if (stderr) {
      console.error(`Git stderr: ${stderr}`);
      return;
    }

    if (stdout) {
      console.log('Найденные коммиты за сегодня:');
      console.log(stdout);
    } else {
      console.log('Коммиты за сегодня не найдены.');
    }
  });
};

main();
