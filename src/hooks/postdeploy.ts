import { spawnSync } from 'node:child_process';

import * as fs from 'node:fs';
import * as path from 'node:path';

const hook = async function (): Promise<void> {
  // console.log('[less] Removing dependencies removed from package.json...')

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const dependenciesToRemove: string[] = [];

  try {
    // Read the package.json file asynchronously
    const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    // Get a list of directories in the './src/shared' directory
    const files = await fs.promises.readdir('./src/shared', { withFileTypes: true });

    // Identify and collect directories to remove
    for (const file of files) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        dependenciesToRemove.push(file.name);
      }
    }

    // Remove the specified dependencies from packageJson
    for (const dependency of dependenciesToRemove) {
      delete packageJson.devDependencies[dependency];
    }

    const updatedPackageJsonContent = JSON.stringify(packageJson, null, 2);

    // Write the updated package.json file asynchronously
    await fs.promises.writeFile(packageJsonPath, updatedPackageJsonContent, 'utf8');
    spawnSync('yarn', ['install', '--cwd', process.cwd()]);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

export default hook;
