import { useHistory } from '../hooks/useHistory'
import { useComputedCallback, ComputedCallback } from './computedCallback'
import { computed } from 'vue'

export const useHistoryReplace = (replaceValue: ComputedCallback<boolean>) => {
  const replace = useComputedCallback(replaceValue)
  const history = useHistory()

  return computed(() => (replace.value ? history.replace : history.push))
}
