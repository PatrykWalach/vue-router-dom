import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { FunctionalComponent, computed } from 'vue'

import {
  RouterMatch,
  MatchPathOptions,
  RouterRouteDescriptor,
} from '../api/types'

import { useMatchToParams } from '../utils/matchToParams'
import { useMatchComponent } from '../utils/matchComponent'
import { matchPath } from '../api/matchPath'
import { useRoute } from './useRoute'

interface UseRoutesOptions extends Omit<MatchPathOptions, 'path'> {
  route: Partial<RouterRouteDescriptor>
}
export const useRoutes = (
  routesValues: ComputedCallback<
    Record<string, FunctionalComponent<RouterMatch<any>>>
  >,
  optionsValue: ComputedCallback<Partial<UseRoutesOptions>> = {},
) => {
  const routes = useComputedCallback(routesValues)
  const options = useComputedCallback(optionsValue)
  const route = useRoute()
  const optionsPathname = computed(() => {
    const route = options.value.route
    return route instanceof Object ? route.path : route
  })

  const matchPathname = computed(
    () => optionsPathname.value || route.value.path,
  )
  const paths = computed(() => Object.keys(routes.value))
  const matchOptions = computed(() => {
    const { strict, sensitive, exact } = options.value
    return { strict, sensitive, exact }
  })

  const match = computed(() =>
    matchPath(matchPathname.value, {
      ...matchOptions.value,
      path: paths.value,
    }),
  )

  useMatchToParams(match)

  const matchedComponent = useMatchComponent(routes, match)

  return matchedComponent
}
