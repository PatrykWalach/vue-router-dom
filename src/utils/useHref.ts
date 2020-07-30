import { useResolvedPath } from './useResolvedPath'
import { useHistory } from '../hooks/useHistory'
import { computed } from 'vue'
import { useComputedCallback } from './computedCallback'

import type { ComputedCallback } from './computedCallback'
import type { To } from 'history'

export const useHref = (toValue: ComputedCallback<To>) => {
  const to = useComputedCallback(toValue)
  const history = useHistory()
  const path = useResolvedPath(to)

  return computed(() => history.createHref(path.value))
}
