import { Command, Flags } from '@oclif/core';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import createLessLocalFolder from '../../helpers/createLessLocalFolder';
import copyAPIRoutes from '../../helpers/copyAPIRoutes';

import { spawn } from 'node:child_process';
import * as chokidar from 'chokidar';

export default class Deploy extends Command {
  static description = 'Deploy your infrastructure locally'

  static examples = [
    '$ lesslocal deploy',
    '$ lesslocal deploy --watch',
  ]

  static flags = {
    watch: Flags.boolean({ char: 'w', description: 'Watch for changes', required: false }),
  }

  static args = {}

  async run(): Promise<void> {
    const { flags } = await this.parse(Deploy);

    const rootDir = process.cwd();
    const sourceDir = path.join(rootDir, 'src', 'apis');
    const lessLocalDir = path.join(rootDir, '.lesslocal');

    const destinationRoot = path.join(lessLocalDir, 'routes');

    await createLessLocalFolder(lessLocalDir, 'routes');

    const build = async () => {
      console.log('[less] Building local api');
      const routes = await copyAPIRoutes(sourceDir, destinationRoot);

      const indexFileContent = `
      const express = require('express');
      const app = express();
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());

      ${routes.map(route => `
        const ${route} = require('./routes/${route}');

        if (${route}.get) app.get('/${route}', ${route}.get);
        if (${route}.post) app.post('/${route}', ${route}.post);
      `).join('')}

      app.listen(3000, () => console.log('[less] Running locally on http://127.0.0.1:3000'));
    `;

      const routesFileContent = `
      const route = (handler, middlewares) => {
        return async (request, response) => {
          const res = {
            body: JSON.stringify(request.body),
            query: request.query,
            params: request.params
          };

          const result = await handler(
            res, {}
          );

          response
            .status(result.statusCode || 200)
            .json(result.body);
        }
    };
    module.exports = route;
    `;

      await Promise.all([
        fs.writeFile(path.join(lessLocalDir, 'index.js'), indexFileContent, 'utf8'),
        fs.writeFile(path.join(lessLocalDir, 'route.js'), routesFileContent, 'utf8'),
      ]);
    };

    await this.config.runHook('predeploy', {});
    await build();

    process.on('SIGINT', async () => {
      console.log('[less] Exiting grafully...');
      await this.config.runHook('postdeploy', {});
      console.log('[less] 🇨🇻');
    });

    if (flags.watch) {
      console.log('[less] Watching for changes...');

      let shell = spawn('node', ['.lesslocal'], {
        stdio: 'inherit',
        cwd: rootDir,
      });

      return new Promise(() => {
        chokidar.watch('src/apis/**/*', {
          persistent: true,
          cwd: rootDir,
        })
        .on('change', async () => {
          console.log('[less] Rebuilding local api...');
          if (shell) shell.kill();
          await build();
          shell = spawn('node', ['.lesslocal'], {
            stdio: 'inherit',
            cwd: rootDir,
          });
        });

        chokidar.watch('src/shared/**/*', {
          persistent: true,
          cwd: rootDir,
        })
        .on('change', async () => {
          console.log('[less] Rebuilding shared...');
          await this.config.runHook('postdeploy', {});
          await this.config.runHook('predeploy', {});

          if (shell) shell.kill();
          shell = spawn('node', ['.lesslocal'], {
            stdio: 'inherit',
            cwd: rootDir,
          });
        });
      });
    }

    return new Promise(() => {
      spawn('node', ['.lesslocal'], {
        stdio: 'inherit',
        cwd: rootDir,
      });
    });
  }
}
