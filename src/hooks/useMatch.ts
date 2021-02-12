import { useComputedCallback } from '../utils/useComputedCallback'
import { computed, toRef } from 'vue'
import { matchPath } from '../api/matchPath'
import { useRouteContext } from '../hooks/useOutlet'

import type { ComputedRef } from 'vue'
import type { ComputedCallback } from '../utils/useComputedCallback'
import type { PathMatch } from '../api/types'

export const useMatch = (
  patternValue: ComputedCallback<string>,
): ComputedRef<PathMatch<Record<string, string>> | null> => {
  const pattern = useComputedCallback(patternValue)
  const context = useRouteContext()

  const match = computed(() => matchPath(pattern.value, context.pathname))

  return match
}
