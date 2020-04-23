import { MatchPathOptions, MatchPathOptionsPath } from '../api/types'
import { computed, provide } from 'vue'
import { ROUTE_PARAMS } from '../api/keys'
import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { matchPath } from '../api/matchPath'
import { useLocation } from './useLocation'

export const useRouteMatch = (
  pathValue: ComputedCallback<MatchPathOptions | MatchPathOptionsPath>,
) => {
  const path = useComputedCallback(pathValue)
  const location = useLocation()
  const match = computed(() => matchPath(location.value.pathname, path.value))

  const params = computed(() => {
    const matchValue = match.value
    return (matchValue && matchValue.params) || {}
  })

  provide(ROUTE_PARAMS, params)

  return match
}
