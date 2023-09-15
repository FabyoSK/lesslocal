import { Command, Flags } from '@oclif/core';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import createLessLocalFolder from '../../helpers/createLessLocalFolder';
import copyAPIRoutes from '../../helpers/copyAPIRoutes';
import copyTopics from '../../helpers/topics/copyTopics';
import symlinkLess from '../../helpers/symlinkLess';

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
    const apisSourceDir = path.join(rootDir, 'src', 'apis');
    const topicsSourceDir = path.join(rootDir, 'src', 'topics');
    const lessLocalDir = path.join(rootDir, '.lesslocal');

    const lessModuleDir = path.join(lessLocalDir, 'less');
    const routesDir = path.join(lessLocalDir, 'routes');
    const topicsDir = path.join(lessModuleDir, 'topics');

    await createLessLocalFolder(lessLocalDir, 'routes');
    await createLessLocalFolder(lessModuleDir, 'topics');

    const buildApis = async () => {
      console.log('[less] Building local api');
      const routes = await copyAPIRoutes(apisSourceDir, routesDir);

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
          const req = {
            body: JSON.stringify(request.body),
            query: request.query,
            params: request.params
          };

          const result = await handler(
            req, {}
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
        fs.writeFile(path.join(lessModuleDir, 'route.js'), routesFileContent, 'utf8'),
      ]);
    };

    const buildTopics = async () => {
      const topics = await copyTopics(topicsSourceDir, topicsDir);

      if (!topics) {
        return;
      }

      const topicIndexContent = `
        ${topics.map(
    topic =>
      `const ${topic} = require('./${topic}');`,
  ).join('\n')}

          module.exports = {
            ${topics.map(topic => topic).join(',\n')}
          };
      `;

      await fs.writeFile(path.join(topicsDir, 'index.js'), topicIndexContent, 'utf8');
    };

    await this.config.runHook('predeploy', {});
    await buildApis();
    await buildTopics();

    await fs.writeFile(
      path.join(lessModuleDir, 'index.js'),
      `
        const topics = require('./topics');
        const route = require('./route');

        module.exports = {
          topics,
          route,
        };
      `,
      'utf8',
    );

    const lessNodeModuleDir = path.join(rootDir, 'node_modules', '@chuva.io');

    try {
      await fs.mkdir(lessNodeModuleDir);
    } catch {}

    await symlinkLess(
      lessModuleDir,
      path.join(lessNodeModuleDir, 'less'),
    );

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
          await buildApis();
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

        chokidar.watch('src/topics/**/*', {
          persistent: true,
          cwd: rootDir,
        })
        .on('change', async () => {
          console.log('[less] Rebuilding topics...');
          if (shell) shell.kill();
          await buildTopics();
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
