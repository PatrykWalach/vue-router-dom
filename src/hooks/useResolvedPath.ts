import { computed } from 'vue'
import { resolvePath } from '../api/resolvePath'
import { useRouteContext } from '../hooks/useOutlet'
import { useComputedCallback } from '../utils/useComputedCallback'

import type { ComputedCallback } from '../utils/useComputedCallback'
import type { To } from 'history'

export const useResolvedPath = (toValue: ComputedCallback<To>) => {
  const to = useComputedCallback(toValue)
  const context = useRouteContext()

  return computed(() => resolvePath(to.value, context.pathname))
}
