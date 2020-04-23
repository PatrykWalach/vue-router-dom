import { RouterMatch } from '../api/types'
import { useComputedCallback, ComputedCallback } from './computedCallback'
import { computed, provide } from 'vue'
import { ROUTE_PARAMS } from '../api/keys'

export const useMatchToParams = (
  matchValue: ComputedCallback<RouterMatch | null>,
) => {
  const match = useComputedCallback(matchValue)

  const params = computed(() => {
    const matchValue = match.value
    return (matchValue && matchValue.params) || {}
  })

  provide(ROUTE_PARAMS, params)

  return params
}
