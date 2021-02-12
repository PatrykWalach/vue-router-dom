import { inject, computed, reactive, toRef } from 'vue'
import { ROUTE_CONTEXT } from '../api/keys'

import type { RouterParams, RouteContextObject } from '../api/types'

export const useRouteContext = <P extends RouterParams = RouterParams>() =>
  inject(
    ROUTE_CONTEXT,
    reactive({
      pathname: '',
      outlet: () => null,
      params: {},
      route: null,
    }),
  ) as RouteContextObject<P>

export const useOutlet = () => {
  return toRef(useRouteContext(), 'outlet')
}
