export { RouterLink } from './components/RouterLink'
export { RouterRoute } from './components/RouterRoute'
export { RouterSwitch } from './components/RouterSwitch'
export { RouterRedirect } from './components/RouterRedirect'

export { useHistory } from './hooks/useHistory'
export { useLocation } from './hooks/useLocation'
export { useRouteMatch } from './hooks/useRouteMatch'
export { useParams } from './hooks/useParams'

export { matchPath } from './matchPath'

export * from './keys'
export * from './types'

export * from 'history'

import { install } from './install'

const VueRouterDom = { install }
export default VueRouterDom
