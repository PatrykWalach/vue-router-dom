import { computed } from 'vue'
import { resolvePath } from '../api/resolvePath'
import { useRouteContext } from '../hooks/useOutlet'
import { useComputedCallback } from '../utils/useComputedCallback'

import { ComputedCallback } from '../utils/useComputedCallback'
import { To } from 'history'

export const useResolvedPath = (toValue: ComputedCallback<To>) => {
  const to = useComputedCallback(toValue)
  const context = useRouteContext()
  const pathname = computed(() => context.value.pathname)
  return computed(() => resolvePath(to.value, pathname.value))
}
