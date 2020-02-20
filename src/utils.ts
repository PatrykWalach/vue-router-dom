import { ComputedCallback } from './types'
import { computed } from 'vue'

export const throwError = () => {
  throw new Error('[vue-router-dom] no Router')
}

export const computedCallback = <T>(value: ComputedCallback<T>) =>
  value instanceof Function ? computed(value) : value
