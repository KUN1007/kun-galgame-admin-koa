import combineRoutes from 'koa-combine-routers'
import type Router from 'koa-router'

const moduleFiles = require.context('./modules', true, /\.ts$/)

const modules: Router[] = moduleFiles
  .keys()
  .reduce((items: Router[], path: string) => {
    const value = moduleFiles(path)
    items.push(value.default)
    return items
  }, [])

export default combineRoutes(modules)
