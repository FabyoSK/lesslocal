import {Hook} from '@oclif/core'
import {spawnSync} from 'node:child_process'

import * as fs from 'node:fs'
import * as path from 'node:path'

const hook: Hook<'postrun'> = async function (opts) {
  process.stdout.write(`PostRun`)
return;
  const package_json_path = path.join(process.cwd(), 'package.json')
  const dependenciesToRemove: string[] = []

  try {
    // Read the package.json file asynchronously
    const package_json_content = await fs.promises.readFile(package_json_path, 'utf8')
    const package_json = JSON.parse(package_json_content)

    // Get a list of directories in the './src/shared' directory
    const files = await fs.promises.readdir('./src/shared', {withFileTypes: true})

    // Identify and collect directories to remove
    for (const file of files) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        dependenciesToRemove.push(file.name)
      }
    }

    // Remove the specified dependencies from package_json
    for (const dependency of dependenciesToRemove) {
      delete package_json.devDependencies[dependency]
    }

    const updated_package_json_content = JSON.stringify(package_json, null, 2)

    // Write the updated package.json file asynchronously
    await fs.promises.writeFile(package_json_path, updated_package_json_content, 'utf8')
    spawnSync('yarn', ['install', '--cwd', process.cwd()])

    console.log('[less] Dependencies removed from package.json')
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

export default hook
