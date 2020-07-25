import { PathFunction, compile } from 'path-to-regexp'
import { RouterParams } from './types'
import { Cache } from '../utils/Cache'

const cache = new Cache<PathFunction<object>>()

const getToPath = (pattern: string) => {
  const cachedResult = cache.get(pattern)

  if (cachedResult) {
    return cachedResult
  }

  const toPath = compile(pattern, { encode: encodeURIComponent })

  cache.set(pattern, toPath)

  return toPath
}

export const generatePath = (pattern: string, params: RouterParams) => {
  const toPath = getToPath(pattern)

  return toPath(params)
}
