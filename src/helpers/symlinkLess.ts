import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const symlinkLess = async (sourceDir: string, destinationDir: string): Promise<void> => {
  try {
    await fs.symlink(
      path.join(sourceDir),
      path.join(destinationDir),
      'dir',
    );
  } catch {}
};

export default symlinkLess;
