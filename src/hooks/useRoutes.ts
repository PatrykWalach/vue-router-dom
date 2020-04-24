import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { FunctionalComponent, computed } from 'vue'

import { useLocation } from './useLocation'
import { RouterMatch, MatchPathOptions } from '../api/types'
import { LocationDescriptor } from 'history'
import { useMatchToParams } from '../utils/matchToParams'
import { useMatchComponent } from '../utils/matchComponent'
import { matchPath } from '../api/matchPath'

interface UseRoutesOptions extends Omit<MatchPathOptions, 'path'> {
  location: LocationDescriptor
}
export const useRoutes = (
  routesValues: ComputedCallback<
    Record<string, FunctionalComponent<RouterMatch<any>>>
  >,
  optionsValue: ComputedCallback<Partial<UseRoutesOptions>> = {},
) => {
  const routes = useComputedCallback(routesValues)
  const options = useComputedCallback(optionsValue)
  const location = useLocation()
  const optionsPathname = computed(() => {
    const location = options.value.location
    return location instanceof Object ? location.pathname : location
  })

  const matchPathname = computed(
    () => optionsPathname.value || location.value.pathname,
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
