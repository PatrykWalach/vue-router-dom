import type {
  Action as NavigationType,
  History,
  Location,
} from '@remix-run/router'
import { invariant, RouteMatch, Router } from '@remix-run/router'
import { computed } from '@vue/reactivity'
import * as vue from 'vue'
import { inject } from 'vue'
import { assert } from '../utils/assert'
import type { VueRouteObject } from './types'

export const DataRouterStateContext: vue.InjectionKey<Readonly<
  vue.Ref<Router['state']>
> | null> = Symbol('DataRouterStateContext')

export const useRouterState = () => vue.inject(DataRouterStateContext, null)

export const DataRouterContext: vue.InjectionKey<Router | null> =
  Symbol('DataRouterContext')

export const useDateRouter = () => vue.inject(DataRouterContext, null)

interface RouteContextObject {
  outlet: vue.Ref<vue.Component | null>
  matches: vue.Ref<RouteMatch<string, VueRouteObject>[]>
}

export const RouteContext: vue.InjectionKey<RouteContextObject> =
  Symbol('RouteContext')

export const useRoute = () =>
  vue.inject(RouteContext, {
    matches: vue.shallowRef([]),
    outlet: vue.shallowRef(null),
  })

export const RouteErrorContext: vue.InjectionKey<
  Readonly<vue.Ref<Error | null>>
> = Symbol('RouteErrorContext')

export const OutletContext: vue.InjectionKey<Readonly<vue.Ref<Error | null>>> =
  Symbol('OutletContext')

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-outlet
 */
export const useOutlet = (context: unknown) => {
  const route = useRoute()

  vue.provide(OutletContext, context)
  return vue.computed(() => route.outlet)
}

interface LocationContextObject {
  location: Readonly<vue.Ref<Location | null>>
  navigationType: Readonly<vue.Ref<NavigationType>>
}

export const LocationContext: vue.InjectionKey<LocationContextObject> =
  Symbol('LocationContext')

export const useLocation = () => {
  const ctx = vue.inject(LocationContext)
  assert(
    ctx?.location,
    'useLocation() may be used only in the context of a <Router> component.',
  )

  return ctx.location
}

export type Navigator = Pick<History, 'go' | 'push' | 'replace' | 'createHref'>

interface NavigationContextObject {
  basename: Readonly<vue.Ref<string>>
  navigator: Readonly<vue.Ref<Navigator>>
  static: Readonly<vue.Ref<boolean>>
}
export const NavigationContext: vue.InjectionKey<NavigationContextObject> =
  Symbol('NavigationContext')

/**
 * Returns the nearest ancestor Route error, which could be a loader/action
 * error or a render error.  This is intended to be called from your
 * errorElement to display a proper error message.
 */
export function useRouteError() {
  let error = inject(RouteErrorContext)
  let state = inject(DataRouterStateContext)
  invariant(state, `useRouteError must be used within a DataRouter`)
  let route = inject(RouteContext)
  let thisRoute = route?.matches.value[route.matches.value.length - 1]

  // If this was a render error, we put it in a RouteError context inside
  // of RenderErrorBoundary
  if (error) {
    return error
  }

  invariant(route, `useRouteError must be used inside a RouteContext`)

  // Otherwise look for errors from our data router state
  return computed(() => {
    invariant(
      thisRoute?.route.id,
      `useRouteError can only be used on routes that contain a unique "id"`,
    )
    return state?.value.errors?.[thisRoute.route.id]
  })
}
