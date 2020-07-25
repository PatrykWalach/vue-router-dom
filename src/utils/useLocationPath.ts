import { ComputedCallback, useComputedCallback } from './computedCallback'
import { PartialLocation } from 'history'
import { useLocation } from '../hooks/useLocation'
import { computed } from 'vue'

export const useLocationPath = (
  locationValue: ComputedCallback<PartialLocation>,
) => {
  const location = useComputedCallback(locationValue)
  const routerLocation = useLocation()

  return computed(
    () => location.value.pathname || routerLocation.value.pathname,
  )
}
