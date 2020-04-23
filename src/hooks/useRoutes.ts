import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { FunctionalComponent, computed, h } from 'vue'
import { matchPath } from '../api/matchPath'
import { useLocation } from './useLocation'
import { RouterMatch } from '../api/types'
import { LocationDescriptorObject } from 'history'

export const useRoutes = (
  routesValues: ComputedCallback<
    Record<string, FunctionalComponent<RouterMatch<any>>>
  >,
  locationOptionValue: ComputedCallback<LocationDescriptorObject> = {},
) => {
  const routes = useComputedCallback(routesValues)
  const locationOption = useComputedCallback(locationOptionValue)
  const location = useLocation()

  const matchPathname = computed(
    () => locationOption.value.pathname || location.value.pathname,
  )

  const matchedPath = computed(() =>
    matchPaths(routes.value, matchPathname.value),
  )

  return matchedPath
}

export const matchPaths = (
  routes: Record<string, FunctionalComponent<RouterMatch<any>>>,
  pathname: string,
): FunctionalComponent => {
  for (const path in routes) {
    const match = matchPath(pathname, path)
    if (match) {
      const Component = routes[path]
      return () => h(Component, match)
    }
  }
  return () => null
}
