import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { computed, ComputedRef } from 'vue'
import { matchPath, PathMatch } from '../api/matchPath'
import { useRouteContext } from '../hooks/useOutlet'

export const useMatch = (
  patternValue: ComputedCallback<string>,
): ComputedRef<PathMatch<Record<string, string>> | null> => {
  const pattern = useComputedCallback(patternValue)
  const context = useRouteContext()
  const pathname = computed(() => context.value.pathname)

  const match = computed(() => matchPath(pattern.value, pathname.value))

  return match
}
