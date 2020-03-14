import { RouterHistory, RouterMemoryHistory } from 'history'
import { ROUTER_HISTORY } from '../keys'
import { assert } from '../utils'
import { inject } from 'vue'

export const useHistory = <
  T extends RouterHistory | RouterMemoryHistory = RouterHistory
>() => {
  const history = inject<T>(ROUTER_HISTORY)

  assert(history, `no history provided to injection`)

  return history
}
