import { BrowserHistory, HashHistory, MemoryHistory } from 'history'
import { ROUTER_HISTORY } from '../keys'
import { assert } from '../utils'
import { inject } from 'vue'

export const useHistory = <
  T extends MemoryHistory | HashHistory | BrowserHistory = BrowserHistory
>() => {
  const history = inject(ROUTER_HISTORY)

  assert(history, `no history provided to injection`)

  return history as T
}
