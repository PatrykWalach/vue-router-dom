import { useLocation } from './useLocation'
import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { MatchPathOptions, MatchPathOptionsPath } from '../api/types'
import { computed } from 'vue'
import { matchPath } from '../api/matchPath'
import { useMatchToParams } from '../utils/matchToParams'

export const useRouteMatch = (
  pathValue: ComputedCallback<MatchPathOptions | MatchPathOptionsPath>,
) => {
  const path = useComputedCallback(pathValue)
  const location = useLocation()
  const match = computed(() => matchPath(location.value.pathname, path.value))

  useMatchToParams(match)

  return match
}
