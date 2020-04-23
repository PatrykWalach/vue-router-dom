import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'

import { useRouteMatch } from './useRouteMatch'
import { watch, computed } from 'vue'
import { LocationDescriptor } from 'history'
import { useHistoryReplace } from '../utils/historyReplace'

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
  const match = useRouteMatch(from)
  const historyGo = useHistoryReplace(() => !push.value)

  return watch(
    match,
    (match) => {
      if (match) {
        historyGo.value(locationTo.value)
      }
    },
    {
      immediate: true,
    },
  )
}
