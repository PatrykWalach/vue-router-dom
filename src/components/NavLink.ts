import { PathFunction, useResolvePath } from '../utils/resolvePath'
import { LocationDescriptor } from 'history'
import { computed, defineComponent, h } from 'vue'
import { RouterLink } from './RouterLink'
import { RouterMatch, RouterRoute } from '../api/types'
import { useRouteMatch } from '../hooks/useRouteMatch'
import { useRoute } from '../hooks/useRoute'
export interface NavLinkProps {
  activeClassName: string
  activeStyle: Record<string, string>
  exact: boolean
  isActive(match: RouterMatch | null, route: RouterRoute): boolean
  strict: boolean
  to: LocationDescriptor | PathFunction
}

export const NavLink = defineComponent({
  name: 'NavLink',
  props: {
    activeClassName: {
      default: '',
      required: false,
      type: String,
    },
    activeStyle: {
      default: () => ({}),
      required: false,
      type: Object,
    },
    exact: {
      default: false,
      required: false,
      //  type: Boolean
    },
    isActive: {
      default: () => Boolean,
      required: false,
      // type: Function,
    },
    strict: {
      default: false,
      required: false,
      // type: Boolean
    },
    to: { default: '', required: true, type: [String, Object, Function] },
  },
  setup(props: Readonly<NavLinkProps>, { slots }) {
    const route = useRoute()

    const path = useResolvePath(() => props.to, route)

    const match = useRouteMatch(() => ({
      exact: props.exact,
      path: path.value.pathname,
      strict: props.strict,
    }))

    const active = computed(() => props.isActive(match.value, route.value))

    return () =>
      h(
        RouterLink,
        {
          class: active.value && props.activeClassName,
          style: active.value && props.activeStyle,
          to: props.to,
        },
        slots.default,
      )
  },
})
