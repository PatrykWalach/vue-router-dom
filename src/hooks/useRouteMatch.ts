import {
  ComputedCallback,
  MatchPathOptions,
  MatchPathOptionsPath,
} from '../types'
import { computed, provide } from 'vue'
import { ROUTE_PARAMS } from '../keys'
import { computedCallback } from '../utils'
import { matchPath } from '../matchPath'
import { useLocation } from './useLocation'

export const useRouteMatch = (
  pathValue: ComputedCallback<MatchPathOptions | MatchPathOptionsPath>,
) => {
  const path = computedCallback(pathValue)
  const location = useLocation()
  const match = computed(() => matchPath(location.value.pathname, path.value))

  provide(
    ROUTE_PARAMS,
    computed(() => (match.value && match.value.params) || {}),
  )

  return match
}
