export const throwError = (error: string) => {
  throw new Error(`[vue-router-dom] ${error}`)
}

export function assert<T>(condition: T, message: string): asserts condition {
  if (!condition) {
    throwError(message)
  }
}
