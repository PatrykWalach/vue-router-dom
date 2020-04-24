import { Key, pathToRegexp } from 'path-to-regexp'
import { Cache } from './Cache'

interface CompilePathOptions {
  end: boolean
  strict: boolean
  sensitive: boolean
}
interface CompilePathResult {
  regexp: RegExp
  keys: Key[]
}

const cache = new Cache<CompilePathResult>()

export const compilePath = (
  path: string,
  {
    end = false,
    strict = false,
    sensitive = false,
  }: Partial<CompilePathOptions> = {
    // end: false,
    // strict: false,
    // sensitive: false,
  },
): CompilePathResult => {
  const cacheKey = `${end}${strict}${sensitive}${path}`

  const cachedResult = cache.get(cacheKey)
  if (cachedResult) {
    return cachedResult
  }

  const keys: Key[] = []
  const regexp = pathToRegexp(path, keys, { end, strict, sensitive })
  const result = { keys, regexp }

  cache.set(cacheKey, result)

  return result
}
