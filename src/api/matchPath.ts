import { compilePath } from '../utils/compilePath'
import {
  RouterParams,
  MatchPathOptions,
  MatchPathOptionsPath,
  RouterMatch,
} from './types'

export const matchPath = <P extends RouterParams = RouterParams>(
  pathname: string,
  rawOptions: MatchPathOptions | MatchPathOptionsPath,
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
