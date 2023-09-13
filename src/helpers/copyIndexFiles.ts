import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import copyAndUpdateImport from './copyAndUpdateImport';

const copyAndUpdateIndexFiles = async (sourceDir: string, destinationDir: string, routeFolder: string): Promise<void> => {
  try {
    const files = await fs.readdir(sourceDir);

    await Promise.all(
      files.map(async file => {
        const sourceFilePath = path.join(sourceDir, file);
        const destinationFilePath = path.join(destinationDir, file);

        const stat = await fs.stat(sourceFilePath);

        if (stat.isDirectory()) {
          await fs.mkdir(destinationFilePath, { recursive: true });
          await copyAndUpdateIndexFiles(sourceFilePath, destinationFilePath, routeFolder);
        } else if (file === 'index.js') {
          await copyAndUpdateImport(sourceFilePath, destinationFilePath);
        }
      }),
    );
  } catch (error) {
    console.error('Error copying and updating index files:', error);
  }
};

export default copyAndUpdateIndexFiles;
