import { spawnSync } from 'node:child_process';

import * as fs from 'node:fs';
import * as path from 'node:path';

const hook = async function (): Promise<void> {
  console.log('[less] Building shared modules...');

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const newDependencies: Record<string, string> = {};

  try {
    // Get a list of directories in the './src/shared' directory
    const files = await fs.promises.readdir('./src/shared', { withFileTypes: true });

    // Identify and collect directories to add as dependencies
    for (const file of files) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        const directoryName = file.name;
        newDependencies[directoryName] = `file:./src/shared/${directoryName}`;
      }
    }

    // Read the package.json file asynchronously
    const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    // Merge the new dependencies into packageJson.devDependencies
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...newDependencies,
    };

    const updatedPackageJsonContent = JSON.stringify(packageJson, null, 2);

    // Write the updated package.json file asynchronously
    await fs.promises.writeFile(packageJsonPath, updatedPackageJsonContent, 'utf8');
    spawnSync('yarn', ['install', '--cwd', process.cwd()]);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

export default hook;
