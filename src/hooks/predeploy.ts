import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const hook = async function (): Promise<void> {
  console.log('[less] Building shared modules...');

  const rootDir = process.cwd();

  try {
    // Get a list of directories in the './src/shared' directory
    const files = await fs.readdir(
      path.join(rootDir, 'src', 'shared'),
      { withFileTypes: true },
    );

    const symlinkLinks: Promise<void>[] = [];
    // Identify and collect directories to add as dependencies
    for (const file of files) {
      if (file.isDirectory() && file.name !== 'node_modules') {
        const directoryName = file.name;

        symlinkLinks.push(
          fs.symlink(
            path.join(rootDir, 'src', 'shared', directoryName),
            path.join(rootDir, 'node_modules', directoryName),
            'dir',
          ));
      }
    }

    await Promise.allSettled(symlinkLinks);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

export default hook;
