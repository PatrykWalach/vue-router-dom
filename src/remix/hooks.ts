import { shallowEqual } from '@babel/types'
import { invariant, joinPaths, Params, warning } from '@remix-run/router'
import { Path, resolveTo, RouteMatch, To } from '@remix-run/router'
import { watch } from 'vue'
import {
  computed,
  inject,
  onBeforeMount,
  reactive,
  Ref,
  ref,
  shallowRef,
  toRefs,
} from 'vue'
import { ComputedCallback, unwrap } from '../utils/useComputedCallback'
import {
  AwaitKey,
  NavigateOptions,
  NavigationKey,
  RouteKey,
  useLocation,
  useNavigation,
  useRoute,
} from './keys'
/**
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
function getPathContributingMatches(matches: RouteMatch[]) {
  return matches.filter(
    (match, index) =>
      index === 0 ||
      (!match.route.index &&
        match.pathnameBase !== matches[index - 1]?.pathnameBase),
  )
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-resolved-path
 */
export function useResolvedPath(to: ComputedCallback<To>): Ref<Path> {
  let route = useRoute()
  let location = useLocation()

  let routePathnamesJson = JSON.stringify(
    getPathContributingMatches(route.value.matches).map(
      (match) => match.pathnameBase,
    ),
  )

  return computed(() =>
    resolveTo(
      unwrap(to),
      JSON.parse(routePathnamesJson),
      location.value.pathname,
    ),
  )
}

/**
 * The interface for the navigate() function returned from useNavigate().
 */
export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void
  (delta: number): void
}
/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-navigate
 */
export function useNavigate(): NavigateFunction {
  let navigation = useNavigationKey(
    `useNavigate() may be used only in the context of a <Router> component.`,
  )
  let route = useRoute()
  let location = useLocation()

  let routePathnamesJson = computed(() =>
    JSON.stringify(
      getPathContributingMatches(route.value.matches).map(
        (match) => match.pathnameBase,
      ),
    ),
  )

  const activeRef = ref(false)

  onBeforeMount(() => {
    activeRef.value = true
  })

  let navigate: NavigateFunction = (
    to: To | number,
    options: NavigateOptions = {},
  ) => {
    warning(
      activeRef.value,
      `You should call navigate() in a watchEffect(), not when ` +
        `your component is first rendered.`,
    )

    if (!activeRef.value) return

    if (typeof to === 'number') {
      navigation.navigator.go(to)
      return
    }

    let path = resolveTo(
      to,
      JSON.parse(routePathnamesJson.value),
      location.value.pathname,
    )

    // If we're operating within a basename, prepend it to the pathname prior
    // to handing off to history.  If this is a root navigation, then we
    // navigate to the raw basename which allows the basename to have full
    // control over the presence of a trailing slash on root links
    if (navigation.basename.value !== '/') {
      path.pathname =
        path.pathname === '/'
          ? navigation.basename.value
          : joinPaths([navigation.basename.value, path.pathname])
    }

    ;(!!options.replace
      ? navigation.navigator.replace
      : navigation.navigator.push)(path, options.state, options)
  }

  return navigate
}

function useNavigationKey(message: string) {
  let navigation = inject(NavigationKey)
  invariant(navigation, message)
  return navigation
}

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-href
 */
export function useHref(to: ComputedCallback<To>): Ref<string> {
  const navigation = useNavigationKey(
    `useHref() may be used only in the context of a <Router> component.`,
  )

  let path = useResolvedPath(to)

  // If we're operating within a basename, prepend it to the pathname prior
  // to creating the href.  If this is a root navigation, then just use the raw
  // basename which allows the basename to have full control over the presence
  // of a trailing slash on root links

  return computed(() => {
    const basename = navigation.basename.value
    const { pathname, search, hash } = path.value
    let joinedPathname = pathname

    if (basename !== '/') {
      joinedPathname =
        pathname === '/' ? basename : joinPaths([basename, pathname])
    }

    return navigation.navigator.createHref({
      pathname: joinedPathname,
      search,
      hash,
    })
  })
}

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/docs/en/v6/hooks/use-params
 */
export function useParams<
  ParamsOrKey extends string | Record<string, string | undefined> = string,
>(): Readonly<
  Ref<
    [ParamsOrKey] extends [string] ? Params<ParamsOrKey> : Partial<ParamsOrKey>
  >
> {
  let route = useRoute()
  let routeMatch = computed(
    () => route.value.matches[route.value.matches.length - 1],
  )

  return computed(() => (routeMatch.value?.params as any) ?? {})
}

export type ParamKeyValuePair = [string, string]

export type URLSearchParamsInit =
  | string
  | ParamKeyValuePair[]
  | Record<string, string | string[]>
  | URLSearchParams

/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
export function createSearchParams(
  init: URLSearchParamsInit = '',
): URLSearchParams {
  return new URLSearchParams(
    typeof init === 'string' ||
    Array.isArray(init) ||
    init instanceof URLSearchParams
      ? init
      : Object.entries(init).flatMap(([key, value]): ParamKeyValuePair[] => {
          return Array.isArray(value)
            ? value.map((v) => [key, v])
            : [[key, value]]
        }),
  )
}

export function getSearchParamsForLocation(
  locationSearch: string,
  defaultSearchParams: URLSearchParams,
) {
  let searchParams = createSearchParams(locationSearch)

  for (let key of defaultSearchParams.keys()) {
    if (!searchParams.has(key)) {
      defaultSearchParams.getAll(key).forEach((value) => {
        searchParams.append(key, value)
      })
    }
  }

  return searchParams
}

/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
export function useSearchParams() {
  warning(
    typeof URLSearchParams !== 'undefined',
    `You cannot use the \`useSearchParams\` hook in a browser that does not ` +
      `support the URLSearchParams API. If you need to support Internet ` +
      `Explorer 11, we recommend you load a polyfill such as ` +
      `https://github.com/ungap/url-search-params\n\n` +
      `If you're unsure how to load polyfills, we recommend you check out ` +
      `https://polyfill.io/v3/ which provides some recommendations about how ` +
      `to load polyfills only for users that need them, instead of for every ` +
      `user.`,
  )

  let location = useLocation()

  const params = computed(() =>
    getSearchParamsForLocation(location.value.search, new URLSearchParams()),
  )

  let navigate = useNavigate()

  return {
    [Symbol.iterator]() {
      return params.value[Symbol.iterator]()
    },
    set(name: string, value: string, options?: NavigateOptions) {
      const nextParams = new URLSearchParams(params.value.toString())
      nextParams.set(name, value)
      navigate('?' + nextParams, options)
    },
    sort(options?: NavigateOptions) {
      const nextParams = new URLSearchParams(params.value.toString())
      nextParams.sort()
      navigate('?' + nextParams, options)
    },
    append(name: string, value: string, options?: NavigateOptions) {
      const nextParams = new URLSearchParams(params.value.toString())
      nextParams.append(name, value)
      navigate('?' + nextParams, options)
    },
    delete(name: string, options?: NavigateOptions) {
      const nextParams = new URLSearchParams(params.value.toString())
      nextParams.delete(name)
      navigate('?' + nextParams, options)
    },
    entries() {
      return params.value.entries()
    },
    forEach(...args: Parameters<URLSearchParams['forEach']>) {
      return params.value.forEach(...args)
    },
    get(...args: Parameters<URLSearchParams['get']>) {
      return params.value.get(...args)
    },
    getAll(...args: Parameters<URLSearchParams['getAll']>) {
      return params.value.getAll(...args)
    },
    has(...args: Parameters<URLSearchParams['has']>) {
      return params.value.has(...args)
    },
    keys() {
      return params.value.keys()
    },

    toString() {
      return params.value.toString()
    },
    values() {
      return params.value.values()
    },
  }
}

/**
 * Returns the happy-path data from the nearest ancestor <Await /> value
 */
export function useAsyncValue(): unknown {
  let promise = inject(AwaitKey)
  return computed(() => promise?.value._data)
}

/**
 * Returns the error from the nearest ancestor <Await /> value
 */
export function useAsyncError(): unknown {
  let promise = inject(AwaitKey)
  return computed(() => promise?.value._error)
}
