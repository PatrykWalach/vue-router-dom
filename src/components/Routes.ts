import {
  defineComponent,
  // provide,
  // h,
  computed,
  // VNode,
  // toRefs,
  // watchEffect,
} from 'vue'

// import { ROUTE_CONTEXT } from '../api/keys'
// import { useRouteContext } from '../hooks/useOutlet'
// import { assert } from 'console'
// import { useLocation } from '../hooks/useLocation'
// import { joinPaths } from '../utils/resolvePath'
// import { matchRoutes } from '../utils/matchRoutes'
import { useRoutes } from '../hooks/useRoutes'
import { createRoutesFromChildren } from '../utils/createRoutesFromChildren'

export interface RoutesProps {
  basename: string
}

const useCreateRoutesFromSlots = () => computed(() => [])

export const Routes = defineComponent({
  name: 'Routes',

  props: { basename: { default: '', required: false, type: String } },

  setup(props: Readonly<RoutesProps>, { slots }) {
    const routes = computed(
      () => (slots.default && createRoutesFromChildren(slots.default())) || [],
    )

    const vnode = useRoutes(routes, () => props.basename)

    // watchEffect(() => {
    //   // console.log(vnode.value)
    // })

    return () => vnode.value
  },
})
