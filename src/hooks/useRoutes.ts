import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { Component, computed } from 'vue'
import { matchPath } from '../api/matchPath'
import { useLocation } from './useLocation'

export const useRoutes = (
  routesValues: ComputedCallback<Record<string, Component>>,
) => {
  const routes = useComputedCallback(routesValues)
  const location = useLocation()

  const paths = computed(() => Object.keys(routes.value))
  const matchedPath = computed(
    () =>
      paths.value.find((path) => matchPath(location.value.pathname, path)) ||
      null,
  )

  return computed(() => {
    const matchedPathValue = matchedPath.value
    return matchedPathValue && routes.value[matchedPathValue]
  })
}
