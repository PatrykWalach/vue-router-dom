import { Key, pathToRegexp } from 'path-to-regexp'

interface CompilePathOptions {
  end: boolean
  strict: boolean
  sensitive: boolean
}

interface CompilePathResult {
  regexp: RegExp
  keys: Key[]
}

const cache = new Map<string, Map<string, CompilePathResult>>()

const cacheLimit = 10000
let cacheCount = 0

export const compilePath = (
  path: string,
  options: CompilePathOptions,
): CompilePathResult => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`

  const pathCache = cache.get(cacheKey) || new Map<string, CompilePathResult>()

  cache.set(cacheKey, pathCache)

  const cached = pathCache.get(path)
  if (cached) return cached

  const keys: Key[] = []
  const regexp = pathToRegexp(path, keys, options)
  const result = { keys, regexp }

  if (cacheCount < cacheLimit) {
    pathCache.set(path, result)
    cacheCount++
  }

  return result
}
