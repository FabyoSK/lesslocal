import * as fs from 'node:fs/promises';

const copyFile = async (sourceFilePath: string, destinationFilePath: string): Promise<void> => {
  try {
    const fileContent = await fs.readFile(sourceFilePath, 'utf8');
    await fs.writeFile(destinationFilePath, fileContent, 'utf8');
  } catch (error) {
    console.error(`Error updating and copyFileing ${destinationFilePath}:`, error);
  }
};

export default copyFile;
