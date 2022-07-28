import { invariant, joinPaths, warning } from '@remix-run/router'
import { Path, resolveTo, RouteMatch, To } from '@remix-run/router'
import { computed, inject, onBeforeMount, Ref, ref, toRefs } from 'vue'
import { ComputedCallback, unwrap } from '../utils/useComputedCallback'
import {
  NavigateOptions,
  NavigationKey,
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
      location.value!.pathname,
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
      `You should call navigate() in a React.useEffect(), not when ` +
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
      location.value!.pathname,
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
