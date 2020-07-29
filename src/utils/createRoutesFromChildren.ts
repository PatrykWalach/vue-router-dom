import {
  isVNode,
  VNodeNormalizedChildren,
  renderSlot,
  Slots,
  Fragment,
} from 'vue'
import { RouteObject } from '../api/types'

export const createRoutesFromChildren = (
  normalizedChildren: VNodeNormalizedChildren,
) => {
  const routes: RouteObject[] = []

  // console.log(normalizedChildren)

  const children = Array.isArray(normalizedChildren)
    ? normalizedChildren
    : normalizedChildren instanceof Object
    ? [renderSlot(normalizedChildren as Slots, 'default')]
    : []

  // Array.isArray(normalizedChildren) ||
  //   console.log(normalizedChildren, '-->', children)

  for (const element of children) {
    if (!isVNode(element)) {
      continue
    }
    // console.log(element)
    // console.log(element.children)
    if (element.type === 'template' || element.type === Fragment) {
      // console.log('fragment')
      routes.push(...createRoutesFromChildren(element.children))
      continue
    }

    const { path, from, caseSensitive } = element.props || {}

    const route: RouteObject = {
      path: from || path || '/',
      caseSensitive: caseSensitive === true,
      element,
    }

    if (element.children) {
      const childRoutes = createRoutesFromChildren(element.children)

      if (childRoutes.length) {
        route.children = childRoutes
      }
    }

    routes.push(route)
  }

  return routes
}
