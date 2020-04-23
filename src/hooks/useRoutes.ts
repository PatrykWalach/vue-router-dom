import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { FunctionalComponent, computed } from 'vue'

import { useLocation } from './useLocation'
import { RouterMatch } from '../api/types'
import { LocationDescriptorObject } from 'history'
import { useMatchToParams } from '../utils/matchToParams'
import { useMatchComponent } from '../utils/matchComponent'
import { matchPath } from '../api/matchPath'

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

  const match = computed(() =>
    matchPath(matchPathname.value, Object.keys(routes.value)),
  )

  useMatchToParams(match)

  const matchedComponent = useMatchComponent(routes.value, match.value)

  return matchedComponent
}
