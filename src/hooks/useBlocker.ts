import { useHistory } from './useHistory'
import { watchEffect } from 'vue'
import { useComputedCallback } from '../utils/computedCallback'

import type { Blocker } from 'history'
import type { ComputedCallback } from '../utils/computedCallback'

export const useBlocker = (
  blocker: Blocker,
  whenValue: ComputedCallback<boolean> = true,
) => {
  const when = useComputedCallback(whenValue)
  const history = useHistory()

  watchEffect((onCleanup) => {
    if (!when.value) {
      return
    }

    const unblock = history.block((tx) => {
      blocker({
        ...tx,
        retry() {
          unblock()
          tx.retry()
        },
      })
    })

    onCleanup(unblock)
  })
}
