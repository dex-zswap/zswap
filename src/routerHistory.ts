import { createBrowserHistory } from 'history'

// Manually create the history object so we can access outside the Router e.g. in modals
const history = createBrowserHistory()

const methodKeys = ['push', 'replace']
const ignoreRoutes = ['/add', '/remove']
let originMethod

methodKeys.forEach((methodName) => {
  originMethod = history[methodName]

  history[methodName] = (...args) => {
    const [ target ] = args
    const path = target.pathname ?? target
    originMethod(...args)
    if (ignoreRoutes.some((route) => route.startsWith(path) || (path).startsWith(route))) {
      return
    }
    window.location.reload(true)
  }
})

export default history
