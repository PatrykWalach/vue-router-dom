import { InjectionKey, Ref } from 'vue'
import { HashHistory, MemoryHistory, BrowserHistory } from 'history'
import { RouterParams } from './types'

export const ROUTE_PARAMS: InjectionKey<Readonly<Ref<RouterParams>>> = Symbol(
  'ROUTER_HISTORY',
)

export const ROUTER_HISTORY: InjectionKey<
  HashHistory | MemoryHistory | BrowserHistory
> = Symbol('ROUTER_HISTORY')
