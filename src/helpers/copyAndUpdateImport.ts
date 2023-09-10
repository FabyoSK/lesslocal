import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const copyAndUpdateImport = async (sourceFilePath: string, destinationFilePath: string): Promise<void> => {
  try {
    const fileContent = await fs.readFile(sourceFilePath, 'utf8');
    let updatedContent = fileContent.replace(
      /const { route } = require\('@chuva.io\/less'\);/g,
      "const route = require('../../route.js');"
    );

    const sharedFolder = await fs.readdir('./src/shared', { withFileTypes: true });
    for (const file of sharedFolder) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        const directoryName = file.name

        const relativePath = `../../../src/shared/${directoryName}`;
        updatedContent = updatedContent.replace(`require(\'${directoryName}\')`, `require('${relativePath}')`);
      };
    }

    await fs.writeFile(destinationFilePath, updatedContent, 'utf8')
    // console.log(`Updated and copied ${destinationFilePath}`);
  } catch (error) {
    console.error(`Error updating and copying ${destinationFilePath}:`, error);
  }
};

export default copyAndUpdateImport
