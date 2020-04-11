import { Ref, computed } from 'vue'

export type ComputedCallback<T> = Ref<T> | (() => T)

export const useComputedCallback = <T>(value: ComputedCallback<T>) =>
  value instanceof Function ? computed(value) : value
