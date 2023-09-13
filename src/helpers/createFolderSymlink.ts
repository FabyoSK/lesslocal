import * as fs from 'node:fs/promises'
import * as path from 'node:path'

async function linkSharedModules(inputFolder: string) {
  try {
    const sharedFolder = await fs.readdir(inputFolder, {withFileTypes: true})

    let content = `
          const proxyquire = require('proxyquire');
    `;
    for (const file of sharedFolder) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        const directoryName = file.name
        const sourcePath = path.join(inputFolder, directoryName)
        console.log('🚀 FSK >> file: createFolderSymlink.ts:12 >> sourcePath:', sourcePath);

        content += `
          const ${directoryName} = require("${sourcePath}");
          proxyquire("${directoryName}", );
        `
        // console.log(`Created symlink for ${directoryName}`)
      }
    }
    return content;
  } catch (error) {
    console.error('Error creating symlinks:', error)
  }
}

export default linkSharedModules
