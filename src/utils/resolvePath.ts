import { PartialLocation, State, Location, To } from 'history'
import { computed } from 'vue'
import { useComputedCallback, ComputedCallback } from './computedCallback'

export type PathFunction = (location: PartialLocation) => To

export const resolvePath = <S extends State = State>(
  path: PartialLocation<S> | PathFunction | string,
  location: PartialLocation,
): PartialLocation<S> => {
  const pathname = path instanceof Function ? path(location) : path
  return pathname instanceof Object ? pathname : { pathname }
}

export const useResolvePath = <S extends State = State>(
  pathValue: ComputedCallback<PartialLocation<S> | PathFunction | string>,
  routeValue: ComputedCallback<PartialLocation>,
) => {
  const path = useComputedCallback(pathValue)
  const route = useComputedCallback(routeValue)
  return computed(() => resolvePath(path.value, route.value))
}
