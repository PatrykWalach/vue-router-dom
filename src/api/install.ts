import { History, MemoryHistory } from 'history'
import { App } from 'vue'
import { ROUTER_HISTORY } from './keys'

import { RouterLink } from '../components/RouterLink'
import { RouterRoute } from '../components/RouterRoute'
// import { RouterSwitch } from '../components/RouterSwitch'
import { NavLink } from '../components/NavLink'
import { RouterRedirect } from '../components/RouterRedirect'

export const install = (app: App, history: History | MemoryHistory) =>
  app
    .provide(ROUTER_HISTORY, history)
    .component('NavLink', NavLink)
    .component('RouterLink', RouterLink)
    .component('RouterRedirect', RouterRedirect)
    .component('RouterRoute', RouterRoute)
// .component('RouterSwitch', RouterSwitch)
