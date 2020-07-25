import { RouterMatch } from '../api/types'
import { useComputedCallback, ComputedCallback } from './computedCallback'
import { computed } from 'vue'

export const useMatchToParams = (
  matchValue: ComputedCallback<RouterMatch | null>,
) => {
  const match = useComputedCallback(matchValue)

  const params = computed(() => {
    const matchValue = match.value
    return (matchValue && matchValue.params) || {}
  })

  return params.value
}
