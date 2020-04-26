import { useLocation } from './useLocation'
import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { MatchPathOptions, MatchPathOptionsPath } from '../api/types'
import { computed } from 'vue'
import { matchPath } from '../api/matchPath'
import { useMatchToParams } from '../utils/matchToParams'
import { useRoute } from './useRoute'

export const useRouteMatch = (
  pathValue: ComputedCallback<MatchPathOptions | MatchPathOptionsPath>,
) => {
  const path = useComputedCallback(pathValue)
  const route = useRoute()
  const match = computed(() => matchPath(route.value.path, path.value))

  useMatchToParams(match)

  return match
}
