export class Cache<T> {
  cacheLimit: number
  cacheCount = 0
  cache = new Map<string, T>()

  constructor(cacheLimit = 10000) {
    this.cacheLimit = cacheLimit
  }

  get(cacheKey: string) {
    return this.cache.get(cacheKey)
  }

  has(cacheKey: string) {
    return this.cache.has(cacheKey)
  }

  set(cacheKey: string, result: T) {
    if (this.cacheCount < this.cacheLimit) {
      this.set(cacheKey, result)
      this.cacheCount++
    }
  }
}
