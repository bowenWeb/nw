import { createStore, createLogger } from 'vuex'

const mergeModules = (() => {
  const modulesFiles = require.context('./modules', true, /\.ts$/)
  return modulesFiles.keys().reduce((modules:any, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
  }, {})
})()

const debug = process.env.NODE_ENV !== 'production'
const plugins = debug ? [createLogger({})] : []

export const store = createStore({
  plugins,
  modules: {
    ...mergeModules
  }
})

