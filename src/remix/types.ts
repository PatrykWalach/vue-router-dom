import type { Component, DefineComponent } from 'vue'
import { Action, Location, History } from 'history'
import {
  ActionFunction,
  LoaderFunction,
  ShouldRevalidateFunction,
} from '@remix-run/router'
/**
 * A route object represents a logical route, with (optionally) its child
 * routes organized in a tree-like structure.
 */
export interface VueRouteObject {
  caseSensitive?: boolean
  children?: VueRouteObject[]
  element?: DefineComponent
  index?: boolean
  path?: string
  id?: string
  loader?: LoaderFunction
  action?: ActionFunction
  fallback?: DefineComponent
  shouldRevalidate?: ShouldRevalidateFunction
  handle?: any
}

export type RouterParams = Record<string, string>

export type Navigator = Pick<History, 'go' | 'push' | 'replace' | 'createHref'>
