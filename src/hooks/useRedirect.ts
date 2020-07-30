import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'

import { computed } from 'vue'

import { To } from 'history'
import { MatchPathOptions, MatchPathOptionsPath } from '../api/types'
import { useNavigate } from './useNavigate'
import { useHref } from '../utils/useHref'

export const useRedirect = (
  optionsValue: ComputedCallback<MatchPathOptions | MatchPathOptionsPath>,
  toValue: ComputedCallback<To>,
  pushValue: ComputedCallback<boolean> = false,
) => {
  const to = useComputedCallback(toValue)
  const push = useComputedCallback(pushValue)
  const options = useComputedCallback(optionsValue)

  const routeMatchOptions = computed(() => {
    const optionsValue = options.value

    return optionsValue instanceof Object
      ? optionsValue
      : { path: optionsValue }
  })

  const toLocation = computed(() => {
    const toValue = to.value
    return toValue instanceof Object ? toValue : { pathname: toValue }
  })

  const toPath = useHref(toLocation)

  // const match = useRouteMatch(routeMatchOptions)

  const navigate = useNavigate()

  // watchEffect(() => {
  //   const matchValue = match.value
  //   if (!matchValue) {
  //     return
  //   }
  //   const nextPath = generatePath(toPath.value, matchValue.params)

  //   navigate(nextPath, { replace: !push.value })
  // })
}
