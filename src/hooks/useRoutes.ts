import {
  computed,
  toRefs,
  watchEffect,
  provide,
  defineComponent,
  VNode,
  h,
  reactive,
} from 'vue'
import { joinPaths } from '../utils/resolvePath'
import { ROUTE_CONTEXT } from '../api/keys'
import { useRouteContext } from '../hooks/useOutlet'
import { useLocation } from './useLocation'
import { assert } from '../utils/assert'
import { matchRoutes } from '../utils/matchRoutes'
import {
  ComputedCallback,
  useComputedCallback,
} from '../utils/computedCallback'
import { RouteObject } from '../api/types'



const Provide = defineComponent({
  props: {
    injectionKey: { required: true, type: [String, Symbol] },
    value: null,
  },
  setup(props, { slots }) {
    provide(
      props.injectionKey,
      computed(() => props.value),
    )
    return () => slots.default && slots.default()
  },
})

export const useRoutes = (
  routesValue: ComputedCallback<RouteObject[]>,
  basenameValue: ComputedCallback<string> = '',
) => {
  const routes = useComputedCallback(routesValue)
  const defaultBasename = useComputedCallback(basenameValue)

  const context = useRouteContext()

  const parentRoute = computed(() => context.value.route)
  const parentPathname = computed(() => context.value.pathname)
  const parentParams = computed(() => context.value.params)

  const location = useLocation()

  const parentPath = computed(() => parentRoute.value && parentRoute.value.path)

  watchEffect(() => {
    const parentRouteValue = parentRoute.value

    assert(
      !parentRouteValue || parentRouteValue.path.endsWith('*'),
      `You rendered descendant <Routes> (or called \`useRoutes\`) at "${parentPathname.value}"` +
        ` (under <Route path="${parentPath.value}">) but the parent route path has no trailing "*".` +
        ` This means if you navigate deeper, the parent won't match anymore and therefore` +
        ` the child routes will never render.` +
        `\n\n` +
        `Please change the parent <Route path="${parentPath.value}"> to <Route path="${parentPath.value}/*">.`,
    )
  })

  const basename = computed(() => {
    const basename = defaultBasename.value
    const parentPathnameValue = parentPathname.value

    return basename
      ? joinPaths([parentPathnameValue, basename])
      : parentPathnameValue
  })

  const matches = computed(() =>
    matchRoutes(routes.value, location.value, basename.value),
  )

  // console.log(matches.value)

  return computed(
    () =>
      matches.value &&
      matches.value.reduceRight<VNode | null>(
        (outlet, { params, pathname, route }) =>
          h(
            Provide,
            {
              injectionKey: ROUTE_CONTEXT as symbol,
              value: {
                outlet,
                params: { ...parentParams.value, ...params },
                pathname: joinPaths([basename.value, pathname]),
                route,
              },
            },
            { default: () => [route.element] },
          ),
        null,
      ),
  )
}
