import { RouterHistory, RouterMemoryHistory } from 'history'
import { App } from 'vue'
import { ROUTER_HISTORY } from './keys'

//install temporarly disabled because of type error
// import { RouterLink } from './components/RouterLink'
// import { RouterRoute } from './components/RouterRoute'
// import { RouterSwitch } from './components/RouterSwitch'

export const install = (
  app: App,
  history: RouterHistory | RouterMemoryHistory,
) => app.provide(ROUTER_HISTORY, history)
// .component('NavLink', NavLink)
// .component('RouterLink', RouterLink)
// .component('RouterRedirect', RouterRedirect)
// .component('RouterRoute', RouterRoute)
// .component('RouterSwitch', RouterSwitch)
