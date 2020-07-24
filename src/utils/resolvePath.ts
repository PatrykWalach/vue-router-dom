import { PartialLocation, State, Location, To } from 'history'
import { computed } from 'vue'
import { useComputedCallback, ComputedCallback } from './computedCallback'

export type PathFunction<S extends State = State> = (location: Location) => To

export const resolvePath = <S extends State = State>(
  path: PartialLocation<S> | PathFunction<S> | string,
  location: Location,
): PartialLocation<S> => {
  const pathname = path instanceof Function ? path(location) : path
  return pathname instanceof Object ? pathname : { pathname }
}

export const useResolvePath = <S extends State = State>(
  pathValue: ComputedCallback<PartialLocation<S> | PathFunction<S> | string>,
  routeValue: ComputedCallback<Location>,
) => {
  const path = useComputedCallback(pathValue)
  const route = useComputedCallback(routeValue)
  return computed(() => resolvePath(path.value, route.value))
}
