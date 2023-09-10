import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import copyAndUpdateImport from './copyAndUpdateImport';

const copyIndexFiles = async (sourceDir: string, destinationDir: string): Promise<void> => {
  try {
    const files = await fs.readdir(sourceDir)

    for (const file of files) {
      const sourceFilePath = path.join(sourceDir, file);
      const destinationFilePath = path.join(destinationDir, file);

      const stat = await fs.stat(sourceFilePath)
      if (stat.isDirectory()) {
        await fs.mkdir(destinationFilePath, { recursive: true })
        await copyIndexFiles(sourceFilePath, destinationFilePath)
      } else if (file === 'index.js') {
        await copyAndUpdateImport(sourceFilePath, destinationFilePath)
      }
    }
  } catch (error) {
    console.error('Error copying and updating index files:', error);
  }
}

export default copyIndexFiles
