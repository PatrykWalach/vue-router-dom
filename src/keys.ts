import { BrowserHistory, HashHistory, MemoryHistory } from 'history'
import { InjectionKey, Ref } from 'vue'
import { RouterParams } from './types'

export const ROUTE_PARAMS: InjectionKey<Readonly<Ref<RouterParams>>> = Symbol(
  'ROUTER_HISTORY',
)

export const ROUTER_HISTORY: InjectionKey<
  MemoryHistory | HashHistory | BrowserHistory
> = Symbol('ROUTER_HISTORY')
