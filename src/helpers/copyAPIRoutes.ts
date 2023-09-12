import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import copyIndexFiles from './copyIndexFiles'

const copyAPIRoutes = async (sourceDir: string, destinationRoot: string) => {
  const apiFolders = await fs.readdir(sourceDir)
  const routePromises = []

  for (const apiFolder of apiFolders) {
    const apiFolderPath = path.join(sourceDir, apiFolder)
    const apiFolderStat = await fs.stat(apiFolderPath)

    if (apiFolderStat.isDirectory()) {
      const routeFolders = await fs.readdir(apiFolderPath)

      for (const routeFolder of routeFolders) {
        const sourceRouteDir = path.join(apiFolderPath, routeFolder)
        const destinationRouteDir = path.join(destinationRoot, routeFolder)

        routePromises.push(
          (async () => {
            await fs.mkdir(destinationRouteDir, {
              recursive: true,
            })
            await copyIndexFiles(sourceRouteDir, destinationRouteDir, routeFolder)

            return routeFolder
          })(),
        )
      }
    }
  }

  // Wait for all route copies to complete in parallel
  const routes = await Promise.all(routePromises)

  return routes
}

export default copyAPIRoutes
