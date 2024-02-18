import combineRoutes from 'koa-combine-routers'
import Router from 'koa-router'

const moduleFiles = require.context('./modules', true, /\.ts$/)

const modules: Array<Router> = moduleFiles
  .keys()
  .reduce((items: Array<Router>, path: string) => {
    const value = moduleFiles(path)
    items.push(value.default)
    return items
  }, [])

export default combineRoutes(modules)
