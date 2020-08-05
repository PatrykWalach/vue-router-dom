import { useComputedCallback } from '../utils/useComputedCallback'
import { computed } from 'vue'
import { matchPath } from '../api/matchPath'
import { useRouteContext } from '../hooks/useOutlet'

import { ComputedRef } from 'vue'
import { ComputedCallback } from '../utils/useComputedCallback'
import { PathMatch } from '../api/types'

export const useMatch = (
  patternValue: ComputedCallback<string>,
): ComputedRef<PathMatch<Record<string, string>> | null> => {
  const pattern = useComputedCallback(patternValue)
  const context = useRouteContext()
  const pathname = computed(() => context.value.pathname)

  const match = computed(() => matchPath(pattern.value, pathname.value))

  return match
}
