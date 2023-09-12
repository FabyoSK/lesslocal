import {Hook} from '@oclif/core'
import {spawnSync} from 'node:child_process'

import * as fs from 'node:fs'
import * as path from 'node:path'

const hook: Hook<'prerun'> = async function (opts) {
  // process.stdout.write(`example hook running ${opts.Command.name}\n`)

  const package_json_path = path.join(process.cwd(), 'package.json')
  const new_dependencies: Record<string, string> = {}

  try {
    // Get a list of directories in the './src/shared' directory
    const files = await fs.promises.readdir('./src/shared', {withFileTypes: true})

    // Identify and collect directories to add as dependencies
    for (const file of files) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        const directory_name = file.name
        new_dependencies[directory_name] = `file:./src/shared/${directory_name}`
      }
    }

    // Read the package.json file asynchronously
    const package_json_content = await fs.promises.readFile(package_json_path, 'utf8')
    const package_json = JSON.parse(package_json_content)

    // Merge the new dependencies into package_json.devDependencies
    package_json.devDependencies = {
      ...package_json.devDependencies,
      ...new_dependencies,
    }

    const updated_package_json_content = JSON.stringify(package_json, null, 2)

    // Write the updated package.json file asynchronously
    await fs.promises.writeFile(package_json_path, updated_package_json_content, 'utf8')
    spawnSync('yarn', ['install', '--cwd', process.cwd()])

    console.log('[less] Dependencies added from package.json')
  } catch (error) {
    console.error('An error occurred:', error)
  }
}

export default hook
