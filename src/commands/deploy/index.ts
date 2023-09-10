import {Args, Command, Flags} from '@oclif/core'
import * as express from 'express'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import createLessLocalFolder from '../../helpers/createLessLocalFolder'
import copyIndexFiles from '../../helpers/copyIndexFiles'

export default class Deploy extends Command {
  static description = 'Say Deploy'

  static examples = [
    `$ oex Deploy friend --from oclif
Deploy friend from oclif! (./src/commands/Deploy/index.ts)
`,
  ]

  static flags = {
    // from: Flags.string({char: 'f', description: 'Who is saying Deploy', required: true}),
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

    const routes = []

    await createLessLocalFolder(lessLocalDir, 'routes')

    const apiFolders = await fs.readdir(sourceDir)
    for (const apiFolder of apiFolders) {
      const apiFolderPath = path.join(sourceDir, apiFolder)
      if ((await fs.stat(apiFolderPath)).isDirectory()) {
        const routeFolders = await fs.readdir(apiFolderPath)
        for (const routeFolder of routeFolders) {
          const sourceRouteDir = path.join(apiFolderPath, routeFolder)
          const destinationRouteDir = path.join(destinationRoot, routeFolder)

          await fs.mkdir(destinationRouteDir, {recursive: true})
          await copyIndexFiles(sourceRouteDir, destinationRouteDir)
          routes.push(routeFolder)
        }
      }
    }

    const indexFileContent = `
      const express = require('express');
      const app = express();
      app.use(express.urlencoded({ extended: false }));

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
            body: request.body,
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
}
