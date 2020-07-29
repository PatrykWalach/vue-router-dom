import { inject, computed } from 'vue'
import { ROUTE_CONTEXT } from '../api/keys'

export const useRouteContext = () =>
  inject(
    ROUTE_CONTEXT,
    computed(() => ({ pathname: '', outlet: null, params: {}, route: null })),
  )

export const useOutlet = () => {
  const context = useRouteContext()
  return computed(() => context.value.outlet)
}
