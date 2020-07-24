export { RouterLink } from './components/RouterLink'
export { NavLink } from './components/NavLink'
export { RouterRoute } from './components/RouterRoute'
export { RouterSwitch } from './components/RouterSwitch'
export { RouterRedirect } from './components/RouterRedirect'

export { useHistory } from './hooks/useHistory'
export { useLocation } from './hooks/useLocation'
export { useParams } from './hooks/useParams'
export { useRouteMatch } from './hooks/useRouteMatch'

export { matchPath } from './api/matchPath'
export { generatePath } from './api/generatePath'
import { install } from './api/install'

export * from './api/keys'
export * from './api/types'

export * from 'history'

const VueRouterDom = { install }
export default VueRouterDom
