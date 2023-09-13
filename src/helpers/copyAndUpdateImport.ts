import * as fs from 'node:fs/promises';

const copyAndUpdateImport = async (sourceFilePath: string, destinationFilePath: string): Promise<void> => {
  try {
    const fileContent = await fs.readFile(sourceFilePath, 'utf8');
    const updatedContent = fileContent.replace(
      /const { route } = require\('@chuva.io\/less'\);/g,
      "const route = require('../../route.js');",
    );

    await fs.writeFile(destinationFilePath, updatedContent, 'utf8');
  } catch (error) {
    console.error(`Error updating and copying ${destinationFilePath}:`, error);
  }
};

export default copyAndUpdateImport;
