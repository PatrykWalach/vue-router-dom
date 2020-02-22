import { ComputedCallback } from './types'
import { computed } from 'vue'

export const throwError = (error: string) => {
  throw new Error(`[vue-router-dom] ${error}`)
}

export const computedCallback = <T>(value: ComputedCallback<T>) =>
  value instanceof Function ? computed(value) : value

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throwError(message)
  }
}
