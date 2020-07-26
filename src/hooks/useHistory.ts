import { MemoryHistory, History, BrowserHistory, HashHistory } from 'history'
import { ROUTER_HISTORY } from '../api/keys'
import { assert } from '../utils/assert'
import { inject } from 'vue'

export const useHistory = <
  T extends BrowserHistory | HashHistory | MemoryHistory = BrowserHistory
>() => {
  const history = inject<T>(ROUTER_HISTORY)

  assert(history, `no history provided to injection`)

  return history
}
