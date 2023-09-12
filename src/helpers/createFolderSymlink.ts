import * as fs from 'node:fs/promises'
import * as path from 'node:path'

async function createSymlinks(inputFolder: string, outputFolder: string) {
  try {
    const sharedFolder = await fs.readdir(inputFolder, {withFileTypes: true})

    for (const file of sharedFolder) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        const directoryName = file.name
        const sourcePath = path.join(inputFolder, directoryName)
        const symlinkPath = path.join(outputFolder, directoryName)

        // Create the symlink
        await fs.symlink(sourcePath, symlinkPath, 'dir')

        console.log(`Created symlink for ${directoryName}`)
      }
    }
  } catch (error) {
    console.error('Error creating symlinks:', error)
  }
}

export default createSymlinks
