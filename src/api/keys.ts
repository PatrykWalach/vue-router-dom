import { InjectionKey, Ref } from 'vue'
import { RouterHistory, RouterMemoryHistory } from 'history'
import { RouterParams } from './types'

export const ROUTE_PARAMS: InjectionKey<Readonly<Ref<RouterParams>>> = Symbol(
  'ROUTER_HISTORY',
)

export const ROUTER_HISTORY: InjectionKey<
  RouterHistory | RouterMemoryHistory
> = Symbol('ROUTER_HISTORY')
