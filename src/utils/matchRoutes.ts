import { PartialLocation, parsePath } from 'history'
import { RouteObject } from '../hooks/useRoutes'
import { RouterMatch, RouterParams } from '../api/types'
import { joinPaths } from './resolvePath'
import { matchPath } from '../api/matchPath'

export const matchRoutes = (
  routes: RouteObject[],
  location: string | PartialLocation,
  basename = '',
): RouteMatch[] | null => {
  if (typeof location === 'string') {
    location = parsePath(location)
  }

  let pathname = location.pathname || '/'
  if (basename) {
    const base = basename.replace(/^\/*/, '/').replace(/\/+$/, '')
    if (pathname.startsWith(base)) {
      pathname = pathname === base ? '/' : pathname.slice(base.length)
    } else {
      // Pathname does not start with the basename, no match.
      return null
    }
  }

  const branches = flattenRoutes(routes)
  rankRouteBranches(branches)

  let matches = null
  for (let i = 0; matches == null && i < branches.length; i++) {
    // TODO: Match on search, state too?
    matches = matchRouteBranch(branches[i], pathname)
  }

  return matches
}
type RouteBranch = [string, RouteObject[], number[]]

const paramRe = /^:\w+$/
const dynamicSegmentValue = 2
const emptySegmentValue = 1
const staticSegmentValue = 10
const splatPenalty = -2
const isSplat = (s: string) => s === '*'

function computeScore(path: string): number {
  const segments = path.split('/')
  let initialScore = segments.length
  if (segments.some(isSplat)) {
    initialScore += splatPenalty
  }

  return segments
    .filter((s) => !isSplat(s))
    .reduce(
      (score, segment) =>
        score +
        (paramRe.test(segment)
          ? dynamicSegmentValue
          : segment === ''
          ? emptySegmentValue
          : staticSegmentValue),
      initialScore,
    )
}

function stableSort(array: any[], compareItems: (a: any, b: any) => number) {
  // This copy lets us get the original index of an item so we can preserve the
  // original ordering in the case that they sort equally.
  const copy = array.slice(0)
  array.sort((a, b) => compareItems(a, b) || copy.indexOf(a) - copy.indexOf(b))
}

function rankRouteBranches(branches: RouteBranch[]): void {
  const pathScores = branches.reduce<Record<string, number>>((memo, [path]) => {
    memo[path] = computeScore(path)
    return memo
  }, {})

  // Sorting is stable in modern browsers, but we still support IE 11, so we
  // need this little helper.
  stableSort(branches, (a, b) => {
    const [aPath, , aIndexes] = a
    const aScore = pathScores[aPath]

    const [bPath, , bIndexes] = b
    const bScore = pathScores[bPath]

    return aScore !== bScore
      ? bScore - aScore // Higher score first
      : compareIndexes(aIndexes, bIndexes)
  })
}
function compareIndexes(a: number[], b: number[]): number {
  const siblings =
    a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i])

  return siblings
    ? // If two routes are siblings, we should try to match the earlier sibling
      // first. This allows people to have fine-grained control over the matching
      // behavior by simply putting routes with identical paths in the order they
      // want them tried.
      a[a.length - 1] - b[b.length - 1]
    : // Otherwise, it doesn't really make sense to rank non-siblings by index,
      // so they sort equally.
      0
}

export interface RouteMatch<P extends RouterParams = RouterParams> {
  route: RouteObject
  pathname: string
  params: RouterParams
}

function matchRouteBranch(
  branch: RouteBranch,
  pathname: string,
): RouteMatch[] | null {
  const routes = branch[1]
  let matchedPathname = '/'
  let matchedParams: RouterParams = {}

  const matches: RouteMatch[] = []
  for (let i = 0; i < routes.length; ++i) {
    const route = routes[i]
    const remainingPathname =
      matchedPathname === '/'
        ? pathname
        : pathname.slice(matchedPathname.length) || '/'
    const routeMatch = matchPath(
      {
        path: route.path,
        caseSensitive: route.caseSensitive,
        end: i === routes.length - 1,
      },
      remainingPathname,
    )

    if (!routeMatch) return null

    matchedPathname = joinPaths([matchedPathname, routeMatch.pathname])
    matchedParams = { ...matchedParams, ...routeMatch.params }

    matches.push({
      route,
      pathname: matchedPathname,
      params: matchedParams,
    })
  }

  return matches
}
function flattenRoutes(
  routes: RouteObject[],
  branches: RouteBranch[] = [],
  parentPath = '',
  parentRoutes: RouteObject[] = [],
  parentIndexes: number[] = [],
): RouteBranch[] {
  routes.forEach((route, index) => {
    const path = joinPaths([parentPath, route.path])
    const routes = parentRoutes.concat(route)
    const indexes = parentIndexes.concat(index)

    // Add the children before adding this route to the array so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children) {
      flattenRoutes(route.children, branches, path, routes, indexes)
    }

    branches.push([path, routes, indexes])
  })

  return branches
}
