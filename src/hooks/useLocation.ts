import { onBeforeUnmount, computed, shallowRef } from 'vue'
import { useHistory } from './useHistory'

import type { State, BrowserHistory } from 'history'

export const useLocation = <S extends State = State>() => {
  const history = useHistory<BrowserHistory<S>>()

  const location = shallowRef(history.location)

  const unlisten = history.listen((update) => {
    location.value = update.location
  })

  onBeforeUnmount(unlisten)

  return computed(() => location.value)
}
