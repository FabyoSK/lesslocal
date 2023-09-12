import {Args, Command, Flags} from '@oclif/core'
import * as express from 'express'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import createLessLocalFolder from '../../helpers/createLessLocalFolder'
import copyAPIRoutes from '../../helpers/copyAPIRoutes'
import spawn from '../../utils/asyncSpawn'
import {ChildProcessWithoutNullStreams, SpawnOptions} from 'node:child_process'
const chokidar = require('chokidar')

function wait(shouldWait: boolean) {
  if (shouldWait) setTimeout(wait, 1000)
}

export default class Deploy extends Command {
  static description = 'Say Deploy'

  static examples = [
    `$ oex Deploy friend --from oclif
Deploy friend from oclif! (./src/commands/Deploy/index.ts)
`,
  ]

  static flags = {
    watch: Flags.boolean({char: 'w', description: 'Watch', required: false}),
  }

  static args = {
    // person: Args.string({description: 'Person to say Deploy to', required: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Deploy)

    const rootDir = process.cwd()
    const sourceDir = path.join(rootDir, 'src', 'apis')
    const lessLocalDir = path.join(rootDir, '.lesslocal')
    const destinationRoot = path.join(lessLocalDir, 'routes')

    await createLessLocalFolder(lessLocalDir, 'routes')

    const build = async () => {
      console.log('[less] Building local api')
      const routes = await copyAPIRoutes(sourceDir, destinationRoot)

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
    `

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
    `

      await Promise.all([
        fs.writeFile(path.join(lessLocalDir, 'index.js'), indexFileContent, 'utf8'),
        fs.writeFile(path.join(lessLocalDir, 'route.js'), routesFileContent, 'utf8'),
      ])
    }

    if (flags.watch) {
      console.log('[less] Watching for changes...')
      await build()

      let shell: ChildProcessWithoutNullStreams | null

      await spawn('node', ['.lesslocal'], {
        stdio: 'inherit',
        cwd: rootDir,
      }, (sh: ChildProcessWithoutNullStreams) => {
        shell = sh
      })

      chokidar.watch('src/apis/**/*', {
        persistent: true,
        cwd: rootDir,
      }).on('change', async () => {
        console.log('[less] Rebuilding local api...')
        if (shell) shell.kill()
        await build()
        await spawn('node', ['.lesslocal'], {
          stdio: 'inherit',
          cwd: rootDir,
        }, (sh: ChildProcessWithoutNullStreams) => {
          shell = sh
        })
      })
      return
    }

    // let shouldWait = true
    await build()

    await spawn('node', ['.lesslocal'], {
      stdio: 'inherit',
      cwd: rootDir,
    }, () => {})
  }
}
