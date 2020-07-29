import { ComputedCallback, useComputedCallback } from './computedCallback'
import { computed } from 'vue'
import { resolvePath } from './resolvePath'
import { To } from 'history'
import { useRouteContext } from '../hooks/useOutlet'
// import { useMatch } from '../hooks/useMatch'

export const useResolvedPath = (toValue: ComputedCallback<To>) => {
  const to = useComputedCallback(toValue)
  const context = useRouteContext()
  const pathname = computed(() => context.value.pathname)
  return computed(() => resolvePath(to.value, pathname.value))
}
