import { ComputedCallback, RegisterParams } from '../types'
import { InjectionKey, computed, inject, watch } from 'vue'
import { computedCallback, throwError } from '../utils'
import { ROUTER_PARAMS } from '../keys'

export const PARAM = ':[^/]+'

export const useParams = () => inject(ROUTER_PARAMS, computed(throwError))

export const ROUTER_PARAMS_REGISTER: InjectionKey<RegisterParams> = Symbol(
  'ROUTER_PARAMS_REGISTER',
)

export const useRegisterParams = (routeValue: ComputedCallback<string>) => {
  const route = computedCallback(routeValue)

  const registerParams = inject(ROUTER_PARAMS_REGISTER, throwError)

  watch(
    onCleanup => {
      const unregisterParams = registerParams(route.value)
      onCleanup(unregisterParams)
    },
    {
      // registers params before render
      flush: 'pre',
    },
  )
}
