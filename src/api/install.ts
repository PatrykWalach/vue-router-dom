import {
  MemoryHistory,
  createBrowserHistory,
  BrowserHistory,
  HashHistory,
} from 'history'
import { App } from 'vue'
import { ROUTER_HISTORY } from './keys'

import { Link } from '../components/Link'
import { Route } from '../components/Route'
import { Switch } from '../components/Switch'
import { NavLink } from '../components/NavLink'
import { Redirect } from '../components/Redirect'
import { WithRouter } from '../components/WithRouter'

export const install = (
  app: App,
  history:
    | BrowserHistory
    | HashHistory
    | MemoryHistory = createBrowserHistory(),
) =>
  app
    .provide(ROUTER_HISTORY, history)
    .component('NavLink', NavLink)
    .component('Link', Link)
    .component('Redirect', Redirect)
    .component('Route', Route)
    .component('Switch', Switch)
    .component('WithRouter', WithRouter)
