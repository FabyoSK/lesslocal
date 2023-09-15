import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const copyTopics = async (sourceFilePath: string, destinationFilePath: string): Promise<string[] | undefined> => {
  try {
    // read ./src/topics and copy the folders

    const topics = await fs.readdir(sourceFilePath);
    console.log('🚀 FSK >> file: copyTopics.ts:13 >> topics:', topics);
    for (const topic of topics) {
      const destinationTopicPath = path.join(destinationFilePath, topic);
      await fs.mkdir(destinationTopicPath);
      const processors = await fs.readdir(`${sourceFilePath}/${topic}`);

      for (const processor of processors) {
        const sourcetopicPath = path.join(sourceFilePath, topic);

        await fs.mkdir(
          path.join(destinationTopicPath, processor),
        );

        const fileContent = await fs.readFile(
          path.join(sourcetopicPath, processor, 'index.js'),
        );

        await fs.writeFile(
          path.join(destinationTopicPath, processor, 'index.js'),
          fileContent,
        );
      }

      const indexContent = `
        ${processors.map(
          (processor) =>
            `const ${processor} = require('./${processor}');`,
          ).join('\n')}

          const publish = async (payload) => {
            console.log('[less] Publishing to Topic => ${topic}')
            const processors = [${processors.map(
              (processor) => `${processor}`,
            ).join(',')}];

            await Promise.allSettled(
              processors.map(
                processor => {
                  return processor.process(JSON.stringify(payload))
                }
              )
              );
          };

          module.exports = {
            publish
          };
      `;

      await fs.writeFile(
        path.join(destinationTopicPath, 'index.js'),
        indexContent,
      );
    }

    return topics;
  } catch (error) {
    console.error(`Error updating and copying ${destinationFilePath}:`, error);
  }
};

export default copyTopics;
