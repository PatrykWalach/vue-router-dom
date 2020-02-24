import { PathFunction, compile } from 'path-to-regexp'
import { RouterParams } from './types'

const cache = new Map<string, PathFunction<object>>()

const cacheLimit = 10000
let cacheCount = 0

export const generatePath = (pattern: string, params: RouterParams) => {
  const cached = cache.get(pattern)
  if (cached) return cached

  const toPath = compile(pattern, { encode: encodeURIComponent })

  if (cacheCount < cacheLimit) {
    cache.set(pattern, toPath)
    cacheCount++
  }

  return toPath(params)
}
