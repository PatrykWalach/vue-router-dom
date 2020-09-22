import { reactive, readonly, watch } from 'vue'
import { useComputedCallback, ComputedCallback } from './useComputedCallback'
import { Update, BrowserHistory, MemoryHistory } from 'history'
import { pick } from './pick'

const useReducer = <S extends Record<string, unknown>, A extends unknown[]>(
  reducer: (state: S, ...args: A) => void,
  initialState: S,
) => {
  const state = reactive(initialState)

  const dispatch = (...arg: A) => {
    reducer(state as S, ...arg)
  }

  return [readonly(state), dispatch] as const
}

export const useRouter = (
  historyValue: ComputedCallback<BrowserHistory | MemoryHistory>,
) => {
  const history = useComputedCallback(historyValue)

  const [state, dispatch] = useReducer(
    (state, { action, location }: Update) => {
      state.action = action
      state.location = location
    },
    pick(history.value, ['action', 'location']),
  )

  watch(
    history,
    (history, _, onCleanup) => {
      const unlisten = history.listen(dispatch)
      onCleanup(unlisten)
    },
    {
      flush: 'sync',
      immediate: true,
    },
  )

  return state
}
