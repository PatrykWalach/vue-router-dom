import { Key, pathToRegexp } from 'path-to-regexp'
import {
  MatchPathOptions,
  MatchPathOptionsPath,
  RouterMatch,
  RouterParams,
} from './types'

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

const compilePath = (
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

export const matchPath = <P extends RouterParams = RouterParams>(
  pathname: string,
  rawOptions: MatchPathOptions | MatchPathOptionsPath = {},
) => {
  const options: MatchPathOptions =
    typeof rawOptions === 'string' || Array.isArray(rawOptions)
      ? { path: rawOptions }
      : rawOptions

  const { path, exact = false, strict = false, sensitive = false } = options

  const paths = path instanceof Array ? path : [path]

  return paths.reduce<RouterMatch<P> | null>((matched, path) => {
    if (!path && path !== '') {
      return null
    }
    if (matched) {
      return matched
    }

    const { regexp, keys } = compilePath(path, {
      end: exact,
      sensitive,
      strict,
    })
    const match = regexp.exec(pathname)

    if (!match) {
      return null
    }

    const [url, ...values] = match
    const isExact = pathname === url

    if (exact && !isExact) {
      return null
    }

    return {
      isExact,
      params: keys.reduce<RouterParams>((memo, key, index) => {
        memo[key.name] = values[index]
        return memo
      }, {}),
      path,
      url: path === '/' && url === '' ? '/' : url,
    } as RouterMatch<P>
  }, null)
}
