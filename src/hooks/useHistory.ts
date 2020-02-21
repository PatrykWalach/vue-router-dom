import { BrowserHistory, HashHistory, MemoryHistory } from 'history'
import { ROUTER_HISTORY } from '../keys'
import { inject } from 'vue'

export const useHistory = <
  T extends MemoryHistory | HashHistory | BrowserHistory = MemoryHistory
>() => inject(ROUTER_HISTORY) as T
