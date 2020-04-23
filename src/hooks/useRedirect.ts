import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'

import { useHistory } from './useHistory'
import { useRouteMatch } from './useRouteMatch'
import { watch, computed } from 'vue'
import { LocationDescriptor } from 'history'

export const useRedirect = (
  fromValue: ComputedCallback<string>,
  toValue: ComputedCallback<LocationDescriptor>,
  pushValue: ComputedCallback<boolean> = true,
) => {
  const from = useComputedCallback(fromValue)
  const to = useComputedCallback(toValue)
  const push = useComputedCallback(pushValue)
  const locationTo = computed(() => {
    const toValue = to.value
    return toValue instanceof Object ? toValue : { pathname: toValue }
  })
  const history = useHistory()
  const match = useRouteMatch(from)

  return watch(
    match,
    (match) => {
      if (match) {
        ;(push.value ? history.push : history.replace)(locationTo.value)
      }
    },
    {
      immediate: true,
    },
  )
}
