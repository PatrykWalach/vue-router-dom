import type { Location, Router as DataRouter } from '@remix-run/router'
import * as router from '@remix-run/router'
import * as vue from 'vue'
import {
  Component,
  computed,
  defineComponent,
  DefineComponent,
  h,
  markRaw,
  Ref,
  watchEffect,
} from 'vue'
import { ComputedCallback, unwrap } from '../utils/useComputedCallback'
// import DefaultFallback from './DefaultFallback.vue'
import DefaultFallback from '../components/DefaultFallback.vue'
import { RouteKey, useLocation, useRoute, useRouterState } from './keys'
import Provider from '../components/Provider.vue'
import RenderErrorBoundary from '../components/RenderErrorBoundary.vue'
import type { VueRouteObject } from './types'

const __DEV__ = process.env.NODE_ENV !== 'production'

export const useRoutes = (
  routes: ComputedCallback<VueRouteObject[]>,
  locationArg?: ComputedCallback<Partial<Location> | string | undefined>,
): Ref<vue.Component | null> => {
  const dataRouterStateContext = useRouterState()
  const route = useRoute()

  const routeMatch = computed(
    () => route.value.matches[route.value.matches.length - 1],
  )

  const parentParams = computed(() => routeMatch.value?.params ?? {})
  const parentPathname = computed(() => routeMatch.value?.pathname ?? '/')
  const parentPathnameBase = computed(
    () => routeMatch.value?.pathnameBase ?? '/',
  )
  const parentRoute = computed(() => routeMatch.value?.route)

  if (__DEV__) {
    watchEffect(() => {
      // You won't get a warning about 2 different <Routes> under a <Route>
      // without a trailing *, but this is a best-effort warning anyway since we
      // cannot even give the warning unless they land at the parent route.
      //
      // Example:
      //
      // <Routes>
      //   {/* This route path MUST end with /* because otherwise
      //       it will never match /blog/post/123 */}
      //   <Route path="blog" element={<Blog />} />
      //   <Route path="blog/feed" element={<BlogFeed />} />
      // </Routes>
      //
      // function Blog() {
      //   return (
      //     <Routes>
      //       <Route path="post/:id" element={<Post />} />
      //     </Routes>
      //   );
      // }
      const parentPath = parentRoute.value?.path || ''
      warningOnce(
        parentPathname.value,
        !parentRoute.value || parentPath.endsWith('*'),
        `You rendered descendant <Routes> (or called \`useRoutes()\`) at ` +
          `"${parentPathname.value}" (under <Route path="${parentPath}">) but the ` +
          `parent route path has no trailing "*". This means if you navigate ` +
          `deeper, the parent won't match anymore and therefore the child ` +
          `routes will never render.\n\n` +
          `Please change the parent <Route path="${parentPath}"> to <Route ` +
          `path="${parentPath === '/' ? '*' : `${parentPath}/*`}">.`,
      )
    })
  }

  const locationFromContext = useLocation()

  const location = computed(() => {
    const locationArgUnref = unwrap(locationArg)
    if (locationArgUnref) {
      const parsedLocationArg =
        typeof locationArgUnref === 'string'
          ? router.parsePath(locationArgUnref)
          : locationArgUnref

      router.invariant(
        parentPathnameBase.value === '/' ||
          parsedLocationArg.pathname?.startsWith(parentPathnameBase.value),
        `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, ` +
          `the location pathname must begin with the portion of the URL pathname that was ` +
          `matched by all parent routes. The current pathname base is "${parentPathnameBase.value}" ` +
          `but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`,
      )
      return parsedLocationArg
    }
    return locationFromContext.value
  })

  const pathname = computed(() => location.value?.pathname || '/')
  const remainingPathname = computed(() =>
    parentPathnameBase.value === '/'
      ? pathname.value
      : pathname.value.slice(parentPathnameBase.value.length) || '/',
  )

  const matches = computed(() =>
    router.matchRoutes(unwrap(routes), { pathname: remainingPathname.value }),
  )

  if (__DEV__) {
    watchEffect(() => {
      router.warning(
        parentRoute.value || matches.value != null,
        `No routes matched location "${location.value?.pathname}${location.value?.search}${location.value?.hash}" `,
      )

      router.warning(
        matches.value == null ||
          matches.value[matches.value.length - 1]?.route.element !== undefined,
        `Matched leaf route at location "${location.value?.pathname}${location.value?.search}${location.value?.hash}" does not have an element. ` +
          `This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
      )
    })
  }

  return computed(() =>
    _renderMatches(
      matches.value?.map(
        (match): router.RouteMatch<string, VueRouteObject> => ({
          ...match,
          params: {
            ...parentParams.value,
            ...match.params,
          },
          pathname: router.joinPaths([
            parentPathnameBase.value,
            match.pathname,
          ]),
          pathnameBase:
            match.pathnameBase === '/'
              ? parentPathnameBase.value
              : router.joinPaths([
                  parentPathnameBase.value,
                  match.pathnameBase,
                ]),
        }),
      ) ?? null,
      route.value.matches,
      dataRouterStateContext.value,
    ),
  )
}

export function _renderMatches(
  matches: router.RouteMatch<string, VueRouteObject>[] | null,
  parentMatches: router.RouteMatch<string, VueRouteObject>[] = [],
  dataRouterState?: DataRouter['state'] | null,
): Component | null {
  if (matches == null) return null

  let renderedMatches = matches

  // If we have data errors, trim matches to the highest error boundary
  const errors = dataRouterState?.errors
  if (errors != null) {
    const errorIndex = renderedMatches.findIndex(
      (m) => m.route.id && errors?.[m.route.id],
    )
    router.invariant(
      errorIndex >= 0,
      `Could not find a matching route for the current errors: ${errors}`,
    )
    renderedMatches = renderedMatches.slice(
      0,
      Math.min(renderedMatches.length, errorIndex + 1),
    )
  }

  return renderedMatches.reduceRight<Component | null>(
    (outlet, match, index): Component | null => {
      const error = match.route.id ? errors?.[match.route.id] : null
      // Only data routers handle errors
      const Fallback = dataRouterState
        ? match.route.fallback || DefaultFallback
        : null

      function Children() {
        return (
          <Provider
            injectionKey={RouteKey}
            value={{
              outlet: outlet,
              matches: parentMatches.concat(
                renderedMatches.slice(0, index + 1),
              ),
            }}
          >
            {error ? (
              Fallback && <Fallback />
            ) : match.route.element !== undefined ? (
              <match.route.element />
            ) : (
              <outlet />
            )}
          </Provider>
        )
      }

      // Only wrap in an error boundary within data router usages when we have an
      // errorElement on this route.  Otherwise let it bubble up to an ancestor
      // errorElement
      if (!(dataRouterState && (match.route.fallback || index === 0))) {
        return Children
      }

      return function ErrorBoundary() {
        return (
          <RenderErrorBoundary
            v-slots={{
              fallback: () => Fallback && <Fallback />,
              default: () => <Children />,
            }}
            location={dataRouterState.location}
            error={error}
          />
        )
      }
    },
    null,
  )
}

const alreadyWarned: Record<string, boolean> = {}

function warningOnce(key: string, cond: boolean, message: string) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true
    router.warning(false, message)
  }
}
