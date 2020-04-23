import {
  Location,
  History,
  LocationDescriptor,
  LocationDescriptorObject,
} from 'history'
import { computed } from 'vue'
import { useComputedCallback, ComputedCallback } from './computedCallback'

export type PathFunction<S = History.PoorMansUnknown> = (
  location: Location,
) => LocationDescriptor<S>

export const resolvePath = <S>(
  path: LocationDescriptor<S> | PathFunction<S>,
  location: Location,
): LocationDescriptorObject<S> => {
  const pathname = path instanceof Function ? path(location) : path
  return pathname instanceof Object ? pathname : { pathname }
}

export const useResolvePath = <S>(
  pathValue: ComputedCallback<LocationDescriptor<S> | PathFunction<S>>,
  locationValue: ComputedCallback<Location>,
) => {
  const path = useComputedCallback(pathValue)
  const location = useComputedCallback(locationValue)
  return computed(() => resolvePath(path.value, location.value))
}
