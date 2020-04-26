import { History, LocationDescriptor, LocationDescriptorObject } from 'history'
import { computed } from 'vue'
import { useComputedCallback, ComputedCallback } from './computedCallback'
import { RouterRoute } from '../api/types'

export type PathFunction<S = History.PoorMansUnknown> = (
  route: RouterRoute,
) => LocationDescriptor<S>

export const resolvePath = <S>(
  path: LocationDescriptor<S> | PathFunction<S>,
  route: RouterRoute,
): LocationDescriptorObject<S> => {
  const pathname = path instanceof Function ? path(route) : path
  return pathname instanceof Object ? pathname : { pathname }
}

export const useResolvePath = <S>(
  pathValue: ComputedCallback<LocationDescriptor<S> | PathFunction<S>>,
  routeValue: ComputedCallback<RouterRoute>,
) => {
  const path = useComputedCallback(pathValue)
  const route = useComputedCallback(routeValue)
  return computed(() => resolvePath(path.value, route.value))
}
