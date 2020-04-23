import { InjectionKey, Ref } from 'vue'
import { History, MemoryHistory } from 'history'
import { RouterParams } from './types'

export const ROUTE_PARAMS: InjectionKey<Readonly<Ref<RouterParams>>> = Symbol(
  'ROUTER_HISTORY',
)

export const ROUTER_HISTORY: InjectionKey<History | MemoryHistory> = Symbol(
  'ROUTER_HISTORY',
)
