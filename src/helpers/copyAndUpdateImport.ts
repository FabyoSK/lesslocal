import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import createSymlinks from './createFolderSymlink'

const copyAndUpdateImport = async (sourceFilePath: string, destinationFilePath: string, routeFolder: string): Promise<void> => {
  try {
    const fileContent = await fs.readFile(sourceFilePath, 'utf8')
    const updatedContent = fileContent.replace(
      /const { route } = require\('@chuva.io\/less'\);/g,
      "const route = require('../../route.js');",
    )

    // const sharedDir = path.join(process.cwd(), 'src', 'shared')

    await fs.writeFile(destinationFilePath, updatedContent, 'utf8')
    // await createSymlinks(sharedDir, routeFolder)
    // console.log(`Updated and copied ${destinationFilePath}`);
  } catch (error) {
    console.error(`Error updating and copying ${destinationFilePath}:`, error)
  }
}

export default copyAndUpdateImport
