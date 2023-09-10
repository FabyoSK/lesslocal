import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const createLessLocalFolder = async (rootDir: string, folder: string): Promise<void> => {
  await fs.mkdir(path.join(rootDir, folder), {
    recursive: true,
  })
}

export default createLessLocalFolder
