import { ComputedCallback, useComputedCallback } from './computedCallback'
import { computed } from 'vue'
import { PartialLocation } from 'history'

export const useLocationToHref = (
  locationValue: ComputedCallback<PartialLocation>,
) => {
  const location = useComputedCallback(locationValue)

  return computed(() => {
    const { pathname = '', hash = '', search = '' } = location.value
    return `${pathname}${search}${hash}`
  })
}
