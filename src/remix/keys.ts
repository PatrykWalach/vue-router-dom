import type {
  Action as NavigationType,
  History,
  Location,
} from '@remix-run/router'
import { To } from '@remix-run/router'
import { invariant, RouteMatch, Router } from '@remix-run/router'
import { computed } from '@vue/reactivity'
import * as vue from 'vue'
import { inject } from 'vue'
import { assert } from '../utils/assert'
import type { VueRouteObject } from './types'

export const DataRouterStateKey: vue.InjectionKey<
  Readonly<vue.Ref<Router['state']>>
> = Symbol('DataRouterStateKey')

export const useRouterState = () => {
  const state = vue.inject(DataRouterStateKey, null)
  return state
}

export interface DataRouterKeyObject extends NavigationKeyObject {
  router: Router
}

export const DataRouterKey: vue.InjectionKey<DataRouterKeyObject> =
  Symbol('DataRouterKey')

export const useDataRouter = () => vue.inject(DataRouterKey, null)

type RouteKeyObject = Readonly<
  vue.Ref<{
    outlet: vue.Component | null
    matches: RouteMatch<string, VueRouteObject>[]
  }>
>

export const RouteKey: vue.InjectionKey<RouteKeyObject> = Symbol('RouteKey')

export const useRoute = () =>
  vue.inject(
    RouteKey,
    vue.shallowRef({
      matches: [],
      outlet: null,
    }),
  )

export const RouteErrorKey: vue.InjectionKey<Readonly<vue.Ref<Error | null>>> =
  Symbol('RouteErrorKey')

export const OutletKey: vue.InjectionKey<Readonly<vue.Ref<Error | null>>> =
  Symbol('OutletKey')

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-outlet
 */
export const useOutlet = (value: unknown) => {
  const route = useRoute()

  vue.provide(OutletKey, value)
  return computed(() => route.value.outlet)
}

interface LocationKeyObject {
  location: Readonly<vue.Ref<Location>>
  navigationType: Readonly<vue.Ref<NavigationType>>
}

export const LocationKey: vue.InjectionKey<LocationKeyObject> =
  Symbol('LocationKey')

export const useLocation = () => {
  const ctx = vue.inject(LocationKey)
  assert(
    ctx?.location,
    'useLocation() may be used only in the context of a <Router> component.',
  )

  return ctx.location
}

export interface NavigateOptions {
  replace?: boolean
  state?: any
  resetScroll?: boolean
}

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level <Router> API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */
export interface Navigator {
  createHref: History['createHref']
  go: History['go']
  push(to: To, state?: any, opts?: NavigateOptions): void
  replace(to: To, state?: any, opts?: NavigateOptions): void
}

interface NavigationKeyObject {
  basename: Readonly<vue.Ref<string>>
  navigator: Navigator
  static: Readonly<vue.Ref<boolean>>
}
export const NavigationKey: vue.InjectionKey<NavigationKeyObject> =
  Symbol('NavigationKey')

/**
 * Returns the nearest ancestor Route error, which could be a loader/action
 * error or a render error.  This is intended to be called from your
 * errorElement to display a proper error message.
 */
export function useRouteError() {
  let error = inject(RouteErrorKey, null)
  let state = inject(DataRouterStateKey, null)
  let route = inject(RouteKey, null)
  let thisRoute = computed(() => {
    invariant(route, `useRouteError must be used inside a RouteContext`)
    return route.value.matches[route.value.matches.length - 1]
  })

  // If this was a render error, we put it in a RouteError context inside
  // of RenderErrorBoundary
  if (error) {
    return error
  }

  // Otherwise look for errors from our data router state
  return computed(() => {
    invariant(state, `useRouteError must be used within a DataRouter`)
    invariant(
      thisRoute.value?.route.id,
      `useRouteError can only be used on routes that contain a unique "id"`,
    )
    return state.value.errors?.[thisRoute.value.route.id]
  })
}

/**
 * Returns the loader data for the nearest ancestor Route loader
 */
export function useLoaderData() {
  let state = inject(DataRouterStateKey)

  let route = inject(RouteKey)

  let thisRoute = computed(() => {
    invariant(route, `useLoaderData must be used inside a RouteContext`)
    return route.value.matches[route.value.matches.length - 1]
  })

  return computed(() => {
    invariant(state, `useLoaderData must be used within a DataRouter`)
    invariant(
      thisRoute.value?.route.id,
      `${useLoaderData} can only be used on routes that contain a unique "id"`,
    )
    return state.value.loaderData[thisRoute.value.route.id]
  })
}

/**
 * Returns the action data for the nearest ancestor Route action
 */
export function useActionData() {
  let state = inject(DataRouterStateKey)

  let route = inject(RouteKey)
  invariant(route, `useRouteError must be used inside a RouteContext`)

  return computed(() => {
    invariant(state, `useActionData must be used within a DataRouter`)
    return Object.values(state.value.actionData || {})[0]
  })
}

/**
 * Returns the current navigation, defaulting to an "idle" navigation when
 * no navigation is in progress
 */
export function useNavigation() {
  let state = inject(DataRouterStateKey)
  return computed(() => {
    invariant(state, `useNavigation must be used within a DataRouter`)
    return state.value.navigation
  })
}
