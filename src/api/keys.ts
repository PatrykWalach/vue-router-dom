import { InjectionKey, VNode, Ref } from 'vue'
import { HashHistory, MemoryHistory, BrowserHistory } from 'history'
import { RouterParams, RouteContextObject } from './types'


export const ROUTER_HISTORY: InjectionKey<
  HashHistory | MemoryHistory | BrowserHistory
> = Symbol('ROUTER_HISTORY')



export const ROUTE_CONTEXT: InjectionKey<Ref<RouteContextObject>> = Symbol(
  'ROUTE_CONTEXT',
)
