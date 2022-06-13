import type { Component } from 'vue'
import { Action, Location, History } from 'history'
import { ActionFunction, LoaderFunction, ShouldRevalidateFunction } from '@remix-run/router'
/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
 export interface VueRouteObject {
  caseSensitive?: boolean;
  children?: VueRouteObject[];
  element?: Component
  index?: boolean;
  path?: string;
  id?: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
  fallback?: Component
  shouldRevalidate?: ShouldRevalidateFunction;
  handle?: any;
}

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



export interface PartialRouteObject {
  caseSensitive?: boolean
  children?: PartialRouteObject[]
  element: Component
  path: string
}

export interface RouteContextObject<P extends RouterParams = RouterParams> {
  outlet: Component
  params: P
  pathname: string
  route: VueRouteObject | null
}

export type Navigator = Pick<History, 'go' | 'push' | 'replace' | 'createHref'>

export interface LocationContextObject {
  action: Action
  location: Location
  navigator: Navigator
  static: boolean
}

export type PathPattern =
  | string
  | { path: string; caseSensitive?: boolean; end?: boolean }

export interface PathMatch<P extends RouterParams = RouterParams> {
  path: string
  pathname: string
  params: P
}
