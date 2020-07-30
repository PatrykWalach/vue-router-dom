import { useComputedCallback } from '../utils/computedCallback'
import { useBlocker } from './useBlocker'

import type { ComputedCallback } from '../utils/computedCallback'

export const usePrompt = (
  messageValue: ComputedCallback<string>,
  whenValue: ComputedCallback<boolean> = true,
) => {
  const message = useComputedCallback(messageValue)

  useBlocker((tx) => {
    if (window.confirm(message.value)) {
      tx.retry()
    }
  }, whenValue)
}
