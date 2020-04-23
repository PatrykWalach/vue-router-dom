export class Cache<T> {
  cacheLimit: number
  cacheCount = 0
  map = new Map<string, T>()

  constructor(cacheLimit = 10000) {
    this.cacheLimit = cacheLimit
  }

  get(cacheKey: string) {
    return this.map.get(cacheKey)
  }

  has(cacheKey: string) {
    return this.map.has(cacheKey)
  }

  set(cacheKey: string, value: T) {
    if (this.cacheCount < this.cacheLimit) {
      this.map.set(cacheKey, value)
      this.cacheCount++
    }
  }
}
