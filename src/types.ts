import { Ref } from 'vue'

export interface RouterLocation {
  hash: string
  pathname: string
  search: string
}
export interface RouterHistory {
  push(newPath: string): void
}

export interface RouterMatch {
  isExact: boolean
  params: RouterParams
  path: string
  url: string
}
export interface MatchPathOptions {
  path?: MatchPathOptionsPath
  exact?: boolean
  strict?: boolean
  sensitive?: boolean
}
export type MatchPathOptionsPath = string | string[]

export type RouterParams = Record<string, string>

export type ComputedCallback<T> = Ref<T> | (() => T)

export type UnregisterParams = () => void
export type RegisterParams = (route: string) => UnregisterParams
