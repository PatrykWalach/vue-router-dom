export { Link } from './components/Link'
export { NavLink } from './components/NavLink'
export { Route } from './components/Route'
export { Switch } from './components/Switch'
export { Redirect } from './components/Redirect'
export { WithRouter } from './components/WithRouter'

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
