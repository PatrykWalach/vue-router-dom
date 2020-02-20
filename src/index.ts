export { BrowserRouter } from './components/BrowserRouter'
export { RouterLink } from './components/RouterLink'
export { RouterRoute } from './components/RouterRoute'
export { RouterSwitch } from './components/RouterSwitch'

export { useHistory } from './hooks/useHistory'
export { useLocation } from './hooks/useLocation'
export { useParams } from './hooks/useParams'
export { useRouteMatch } from './hooks/useRouteMatch'

export * from './keys'
export * from './types'

import { install } from './install'

const VueRouterDom = { install }
export default VueRouterDom
