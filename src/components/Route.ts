import {
  defineComponent,
  h,
  // Slot,
  // Component,
  // provide,
  // inject,
  // computed,
  VNode,
  renderSlot,
  Slots,
  FunctionalComponent,
} from 'vue'
// import { useRouteMatch } from '../hooks/useRouteMatch'
// import { WithRouter } from './WithRouter'
// import { PartialLocation } from 'history'
// import { OUTLET_ROUTES } from '../api/keys'
// import { useMatch } from '../hooks/useMatch'
import { Outlet } from './Outlet'

export interface RouteProps {
  caseSensitive: boolean
  element: VNode
  path: string
}

export const Route = defineComponent({
  name: 'Route',

  props: {
    path: {
      default: '',
      required: false,
      type: String,
    },
    caseSensitive: {
      default: false,
      required: false,
      type: Boolean,
    },
    element: {
      default: () => h(Outlet),
      required: false,
      type: null,
    } ,
  },

  setup(props: Readonly<RouteProps>, { slots }) {
    // const prevMatch = useMatch()

    // const nestedPath = computed(() => {
    //   const { path = '' } = prevMatch.value || {}

    //   return path + props.path
    // })

    // const match = useRouteMatch(() => ({
    //   path: nestedPath.value,
    //   sensitive: props.caseSensitive,
    //   exact: true,
    // }))

    // // provide(OUTLET_ROUTES, slots.outlet)

    return () => props.element //|| h(Outlet)
    return () => renderSlot(slots, 'element', undefined, () => [h(Outlet)])
  },
})
