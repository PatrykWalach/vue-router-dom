export const throwError = (error: string) => {
  throw new Error(`[vue-router-dom] ${error}`)
}

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throwError(message)
  }
}
