import { PARAM, ROUTER_PARAMS_REGISTER } from '../hooks/useParams'
import { ROUTER_HISTORY, ROUTER_LOCATION, ROUTER_PARAMS } from '../keys'
import { RouterLocation, RouterParams } from '../types'
import { computed, defineComponent, provide, readonly, ref } from 'vue'

const getLocation = (): RouterLocation => ({
  hash: window.location.hash,
  pathname: window.location.pathname,
  search: window.location.search,
})

export const BrowserRouter = defineComponent({
  setup(_, { slots }) {
    const location = ref(getLocation())

    const splitPathname = computed(() => location.value.pathname.split('/'))

    const paramRoutes = ref(new Map<string, number>())

    const params = computed(() => {
      const params = {} as RouterParams
      for (const [route] of paramRoutes.value) {
        const segments = route.split('/')
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i]

          if (RegExp('^' + PARAM).test(segment)) {
            params[segment.replace(':', '')] = splitPathname.value[i] || ''
          }
        }
      }
      return params
    })

    const registerParams = (route: string) => {
      const tracking = paramRoutes.value.get(route) || 0
      paramRoutes.value.set(route, tracking + 1)

      return () => {
        const tracking = paramRoutes.value.get(route) || 0
        if (tracking === 1) {
          paramRoutes.value.delete(route)
        } else {
          paramRoutes.value.set(route, tracking - 1)
        }
      }
    }

    // const query = computed(() =>
    //   Object.fromEntries(
    //     location.value.search.split(/\?|&/).map(query => {
    //       const [key, value] = query.split('=')
    //       return [key, value]
    //     }),
    //   ),
    // )

    const push = (newPath: string) => {
      history.pushState('', '', newPath)
      location.value = getLocation()
    }

    provide(ROUTER_LOCATION, readonly(location))
    provide(ROUTER_PARAMS_REGISTER, registerParams)
    provide(ROUTER_PARAMS, readonly(params))
    provide(ROUTER_HISTORY, {
      push,
    })

    return slots.default
  },
})
