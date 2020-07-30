import { useResolvedPath } from './useResolvedPath'
import { useHistory } from '../hooks/useHistory'
import { computed } from 'vue'
import { useComputedCallback } from '../utils/computedCallback'

import type { ComputedCallback } from '../utils/computedCallback'
import type { To } from 'history'

export const useHref = (toValue: ComputedCallback<To>) => {
  const to = useComputedCallback(toValue)
  const history = useHistory()
  const path = useResolvedPath(to)

  return computed(() => history.createHref(path.value))
}
