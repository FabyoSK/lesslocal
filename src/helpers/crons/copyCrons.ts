import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const toUpperCase = (str: string): string => str.toUpperCase();

const copyCrons = async (sourceFilePath: string, destinationFilePath: string): Promise<void> => {
  try {
    const cronFolders = await fs.readdir(sourceFilePath);

    const promises = [];
    for (const cron of cronFolders) {
      promises.push(
        async () => {
          const destinationCronPath = path.join(destinationFilePath, cron);
          const sourceCronPath = path.join(sourceFilePath, cron);

          const [fileContent] = await Promise.all([
            fs.readFile(
              path.join(sourceCronPath, 'index.js'),
            ),
            fs.mkdir(
              path.join(destinationCronPath),
            ),
          ]);

          await fs.writeFile(
            path.join(destinationCronPath, 'index.js'),
            fileContent,
          );

          return cron;
        },
      );
    }

    const crons = await Promise.all(
      promises.map(promise => promise()),
    );

    const indexContent = `
        ${crons.map(
            cron =>
              `const ${cron} = require('./${cron}');`,
          ).join('\n')}

          const cronJob = require('node-cron');

          const startCron = async () => {
            console.log('[less] Starting crons')
            const crons = [
              ${crons.map(
                cron => `
                  {
                    fn: () => ${cron}.process(),
                    name: '${cron}',
                    cronExpression: process.env.CRON_${toUpperCase(cron)},
                  },
                `,
              ).join(',\n')}
            ];

            crons.forEach(cron => {
                cronJob.schedule(cron.cronExpression, () => {
                  console.log(\`[less] Cron \${cron.name} is running\`);
                  return cron.fn();
                });
            });
          }

          module.exports = startCron;
      `;

    await fs.writeFile(
      path.join(destinationFilePath, 'index.js'),
      indexContent,
    );
  } catch (error) {
    console.error(`Error updating and copying ${destinationFilePath}:`, error);
  }
};

export default copyCrons;
