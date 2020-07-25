import { useLocation } from './useLocation'
import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { MatchPathOptions, MatchPathOptionsPath } from '../api/types'
import { computed, provide } from 'vue'
import { matchPath } from '../api/matchPath'
import { CLOSEST_MATCH } from '../api/keys'
import { PartialLocation } from 'history'
import { useLocationPath } from '../utils/useLocationPath'

export const useRouteMatch = (
  pathValue: ComputedCallback<MatchPathOptions | MatchPathOptionsPath>,
  locationValue: ComputedCallback<PartialLocation> = {},
) => {
  const path = useComputedCallback(pathValue)
  const location = useComputedCallback(locationValue)
  const pathname = useLocationPath(location)
  
  const match = computed(() => matchPath(pathname.value, path.value))

  provide(CLOSEST_MATCH, match)

  return match
}
