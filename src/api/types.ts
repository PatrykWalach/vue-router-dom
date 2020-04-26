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

export type RouterQuery = Record<string, string>
export interface RouterRouteDescriptor<
  Query extends RouterQuery = RouterQuery
> {
  path: string
  hash: string
  query: Query
}
export interface RouterRoute<Query extends RouterQuery = RouterQuery>
  extends RouterRouteDescriptor<Query> {
  fullPath: string
}
