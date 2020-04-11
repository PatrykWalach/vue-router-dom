import { RouterLocation, RouterMemoryLocation, RouterPath } from 'history'

export type PathFunction = (
  location: RouterLocation | RouterMemoryLocation,
) => RouterPath | string

export const resolvePath = <T>(
  path: T | PathFunction,
  location: RouterLocation,
) => (path instanceof Function ? path(location) : path)
