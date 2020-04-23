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
  options: CompilePathOptions,
): CompilePathResult => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}${path}`

  const cachedResult = cache.get(cacheKey)
  if (cachedResult) {
    return cachedResult
  }

  const keys: Key[] = []
  const regexp = pathToRegexp(path, keys, options)
  const result = { keys, regexp }

  cache.set(cacheKey, result)

  return result
}
