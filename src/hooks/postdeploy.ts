import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const hook = async function (): Promise<void> {
  try {
    // Get a list of directories in the './src/shared' directory
    const files = await fs.readdir(
      path.join(process.cwd(), 'src', 'shared'),
      { withFileTypes: true },
    );

    const symlinkLinks: Promise<void>[] = [];
    // Identify and collect directories to remove
    for (const file of files) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        // remove symlink on node_modules
        const nodeModulesPath = path.join(process.cwd(), 'node_modules', file.name);
        symlinkLinks.push(
          fs.unlink(nodeModulesPath).catch(),
        );
      }
    }

    await Promise.all(symlinkLinks);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

export default hook;
