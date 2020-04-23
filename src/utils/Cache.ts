export class Cache<T> {
  cacheLimit: number
  cacheCount: number
  map: Map<string, T>

  constructor(cacheLimit = 10000) {
    this.cacheLimit = cacheLimit
    this.cacheCount = 0
    this.map = new Map<string, T>()
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
