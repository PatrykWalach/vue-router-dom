import { FunctionalComponent, computed, h } from 'vue'
import { RouterMatch } from '../api/types'
import { useComputedCallback, ComputedCallback } from './computedCallback'

export const matchComponent = (
  routes: Record<string, FunctionalComponent<RouterMatch<any>>>,
  match: RouterMatch | null,
): FunctionalComponent => {
  if (match) {
    const Component = routes[match.path]
    return () => h(Component, match)
  }
  return () => null
}

export const useMatchComponent = (
  routesValues: ComputedCallback<
    Record<string, FunctionalComponent<RouterMatch<any>>>
  >,
  matchValues: ComputedCallback<RouterMatch | null>,
) => {
  const routes = useComputedCallback(routesValues)
  const match = useComputedCallback(matchValues)

  return computed(() => matchComponent(routes.value, match.value))
}
