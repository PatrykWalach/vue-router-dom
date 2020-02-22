import {
  BrowserHistory,
  HashHistory,
  HashLocation,
  Location,
  MemoryHistory,
} from 'history'
import { InjectionKey, Ref } from 'vue'
import { RouterParams } from './types'

export const ROUTER_LOCATION: InjectionKey<Readonly<
  Ref<Location | HashLocation>
>> = Symbol('ROUTER_LOCATION')

export const ROUTER_HISTORY: InjectionKey<
  MemoryHistory | HashHistory | BrowserHistory
> = Symbol('ROUTER_HISTORY')

export const ROUTE_PARAMS: InjectionKey<Readonly<Ref<RouterParams>>> = Symbol(
  'ROUTER_HISTORY',
)
