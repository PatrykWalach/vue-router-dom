import { VNode } from "vue"

export interface RouterMatch<Params extends RouterParams = RouterParams> {
  isExact: boolean
  params: Params
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

export interface RouteObject {
  caseSensitive?: boolean
  children?: RouteObject[]
  element: VNode | null
  path: string
}

export interface RouteContextObject<P extends RouterParams = RouterParams> {
  outlet: VNode | null
  params: P
  pathname: string
  route: RouteObject | null
}