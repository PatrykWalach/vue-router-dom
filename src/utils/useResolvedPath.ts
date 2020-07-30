import { computed } from 'vue'
import { resolvePath } from './resolvePath'
import { useRouteContext } from '../hooks/useOutlet'
import { useComputedCallback } from './computedCallback'

import type { ComputedCallback } from './computedCallback'
import type { To } from 'history'

export const useResolvedPath = (toValue: ComputedCallback<To>) => {
  const to = useComputedCallback(toValue)
  const context = useRouteContext()
  const pathname = computed(() => context.value.pathname)
  return computed(() => resolvePath(to.value, pathname.value))
}
