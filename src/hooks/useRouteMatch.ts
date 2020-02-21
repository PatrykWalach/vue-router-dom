import { ComputedCallback } from '../types'
import { computed } from 'vue'
import { computedCallback } from '../utils'
import { matchPath } from '../matchPath'
import { useLocation } from './useLocation'

export const useRouteMatch = (pathValue: ComputedCallback<string>) => {
  const path = computedCallback(pathValue)
  const location = useLocation()

  return computed(() => matchPath(location.value.pathname, path.value))
}
