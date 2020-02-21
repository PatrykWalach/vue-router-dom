import { InjectionKey, Ref } from 'vue'
import { RouterHistory, RouterLocation } from './types'

export const ROUTER_LOCATION: InjectionKey<Readonly<
  Ref<RouterLocation>
>> = Symbol('ROUTER_LOCATION')

export const ROUTER_HISTORY: InjectionKey<RouterHistory> = Symbol(
  'ROUTER_HISTORY',
)
