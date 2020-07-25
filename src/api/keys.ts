import { InjectionKey, Ref } from 'vue'
import { HashHistory, MemoryHistory, BrowserHistory } from 'history'
import { RouterMatch } from './types'

export const CLOSEST_MATCH: InjectionKey<Ref<RouterMatch | null>> = Symbol(
  'CLOSEST_MATCH',
)

export const ROUTER_HISTORY: InjectionKey<
  HashHistory | MemoryHistory | BrowserHistory
> = Symbol('ROUTER_HISTORY')
