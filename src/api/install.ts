import { Outlet } from '../components/Outlet'
import { Route } from '../components/Route'
import { Routes } from '../components/Routes'
import { Link } from '../components/Link'
import { NavLink } from '../components/NavLink'
// import { Redirect } from '../components/Redirect'
// import { WithRouter } from '../components/WithRouter'

import { ROUTER_HISTORY } from './keys'
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from 'history'

import {
  MemoryHistory,
  BrowserHistory,
  HashHistory,
  BrowserHistoryOptions,
  HashHistoryOptions,
  MemoryHistoryOptions,
} from 'history'
import { App } from 'vue'

export const createBrowserRouter = (options?: BrowserHistoryOptions) => ({
  install: (app: App) => install(app, createBrowserHistory(options)),
})

export const createMemoryRouter = (options?: MemoryHistoryOptions) => ({
  install: (app: App) => install(app, createMemoryHistory(options)),
})

export const createHashRouter = (options?: HashHistoryOptions) => ({
  install: (app: App) => install(app, createHashHistory(options)),
})

export const install = (
  app: App,
  history:
    | BrowserHistory
    | HashHistory
    | MemoryHistory = createBrowserHistory(),
) =>
  app
    .provide(ROUTER_HISTORY, history)
    .component('Link', Link)
    .component('NavLink', NavLink)
    .component('Outlet', Outlet)
    .component('Route', Route)
    .component('Routes', Routes)
// .component('Redirect', Redirect)
// .component('WithRouter', WithRouter)
