import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import confirm from '@inquirer/confirm';
import { spawnSync } from 'node:child_process';

const checkDevDependency = async (rootDir: string, packageName: string): Promise<void> => {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');

  const packageJson = JSON.parse(packageJsonContent);

  packageJson.devDependencies[packageName];
  if (packageJson.devDependencies[packageName] === undefined) {
    const answer = await confirm({ message: `${packageName} is not in devDependencies. Do you want to add it?` });
    if (answer) {
      spawnSync('yarn', ['add', packageName, '--dev'], {
        cwd: rootDir,
        stdio: 'inherit',
      });
    } else {
      console.log(`[less] ${packageName} is required for development, please add it manually`);
      process.exit(1);
    }
  }
};

export default checkDevDependency;
