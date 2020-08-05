import Outlet from '../components/Outlet.vue'

import { h } from 'vue'

import { RouteObject, PartialRouteObject } from './types'

export const createRoutesFromArray = (
  partialRouteObjects: PartialRouteObject[],
): RouteObject[] => {
  return partialRouteObjects.map(partialRoute => {
    const route: RouteObject = {
      path: partialRoute.path || '/',
      caseSensitive: partialRoute.caseSensitive === true,
      element: partialRoute.element || h(Outlet),
    }

    if (partialRoute.children) {
      route.children = createRoutesFromArray(partialRoute.children)
    }

    return route
  })
}
