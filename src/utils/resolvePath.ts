import { Location, LocationDescriptor } from 'history'

export type PathFunction = (location: Location) => LocationDescriptor

export const resolvePath = <T>(path: T | PathFunction, location: Location) =>
  path instanceof Function ? path(location) : path
