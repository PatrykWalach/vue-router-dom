import type { Component, DefineComponent } from 'vue'

import {
  ActionFunction,
  LoaderFunction,
  ShouldRevalidateFunction,
  History,
} from '@remix-run/router'
import type {
  Location,
  RouteMatch,
  Router,
  StaticHandlerContext,
  To,
} from '@remix-run/router'

/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export interface VueRouteObject {
  caseSensitive?: boolean
  children?: VueRouteObject[]
  element?: Component
  index?: boolean
  path?: string
  id?: string
  loader?: LoaderFunction
  action?: ActionFunction
  fallback?: Component
  shouldRevalidate?: ShouldRevalidateFunction
  handle?: any
}

export type RouterParams = Record<string, string>

export type { Router as RemixRouter } from '@remix-run/router'
