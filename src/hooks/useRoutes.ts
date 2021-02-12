import {
  computed,
  watchEffect,
  provide,
  defineComponent,
  h,
  renderSlot,
  InjectionKey,
} from 'vue'
import { joinPaths } from '../api/resolvePath'
import { ROUTE_CONTEXT } from '../api/keys'
import { useRouteContext } from '../hooks/useOutlet'
import { useLocation } from './useLocation'

import { matchRoutes } from '../api/matchRoutes'
import { useComputedCallback } from '../utils/useComputedCallback'

import type { Component, Ref } from 'vue'
import type { ComputedCallback } from '../utils/useComputedCallback'
import type { RouteObject, PartialRouteObject } from '../api/types'
import { createRoutesFromArray } from '../api/createRoutesFromArray'

const Provide = <T>(key: InjectionKey<T>) =>
  defineComponent({
    props: ['value'],
    setup(props, { slots }) {
      provide(key, props.value)
      return () => renderSlot(slots, 'default')
    },
  })

const useJoinPaths = (pathsValue: ComputedCallback<string[]>) => {
  const paths = useComputedCallback(pathsValue)
  return computed(() => joinPaths(paths.value))
}

export const useRoutes_ = (
  routesValue: ComputedCallback<RouteObject[]>,
  basenameValue: ComputedCallback<string> = '',
): Ref<Component> => {
  const routes = useComputedCallback(routesValue)
  const defaultBasename = useComputedCallback(basenameValue)

  const parent = useRouteContext()

  const location = useLocation()

  watchEffect(() => {
    if (parent.route && !parent.route.path.endsWith('*')) {
      console.warn(
        `You rendered descendant <Routes> (or called \`useRoutes\`) at "${parent.pathname}"` +
          ` (under <Route path="${parent.route.path}">) but the parent route path has no trailing "*".` +
          ` This means if you navigate deeper, the parent won't match anymore and therefore` +
          ` the child routes will never render.` +
          `\n\n` +
          `Please change the parent <Route path="${parent.route.path}"> to <Route path="${parent.route.path}/*">.`,
      )
    }
  })

  const joinedPaths = useJoinPaths(() => [
    parent.pathname,
    defaultBasename.value,
  ])

  const basename = computed(() =>
    defaultBasename.value ? joinedPaths.value : parent.pathname,
  )

  const matches = computed(
    () => matchRoutes(routes.value, location.value, basename.value) || [],
  )

  return computed(() =>
    matches.value.reduceRight<Component>(
      (outlet, { params, pathname, route }) => () =>
        h(
          Provide(ROUTE_CONTEXT),
          {
            value: {
              outlet,
              params: {
                ...parent.params,
                ...params,
              },
              pathname: joinPaths([basename.value, pathname]),
              route,
            },
          },
          () => h(route.element),
        ),
      () => null,
    ),
  )
}

export const useRoutes = (
  partialRoutesValue: ComputedCallback<PartialRouteObject[]>,
  basename: ComputedCallback<string> = '',
) => {
  const partialRoutes = useComputedCallback(partialRoutesValue)
  const routes = computed(() => createRoutesFromArray(partialRoutes.value))

  return useRoutes_(routes, basename)
}
