import { PathFunction, useResolvePath } from '../utils/resolvePath'
import { computed, defineComponent, toRef, h } from 'vue'
import { useRouteMatch } from '../hooks/useRouteMatch'
import { useLocation } from '../hooks/useLocation'

import { Location, To, PartialLocation } from 'history'
import { RouterMatch } from '../api/types'
import { Link } from './Link'

export interface NavLinkProps {
  activeClassName: string
  activeStyle: Record<string, string>
  exact: boolean
  isActive(match: RouterMatch | null, location: PartialLocation): boolean
  strict: boolean
  to: To | PathFunction
  location: PartialLocation
  ariaCurrent: string
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
      type: Boolean,
    },
    strict: {
      default: false,
      required: false,
      type: Boolean,
    },
    isActive: {
      default: () => Boolean,
      required: false,
      type: Function,
    } as any,
    location: {
      default: null,
      type: Object,
      required: false,
    },
    ariaCurrent: {
      default: 'page',
      required: true,
      type: String,
    },
    to: { default: '', required: true, type: [String, Object, Function] },
  },

  setup(props: Readonly<NavLinkProps>, { slots }) {
    const routerLocation = useLocation()
    const location = computed(() => props.location || routerLocation.value)

    const path = useResolvePath(toRef(props, 'to'), location)

    const match = useRouteMatch(() => ({
      exact: props.exact,
      path: path.value.pathname,
      strict: props.strict,
    }))

    const active = computed(() => props.isActive(match.value, location.value))

    const className = computed(() => active.value && props.activeClassName)

    const style = computed(() => active.value && props.activeStyle)

    return () =>
      h(
        Link,
        {
          style: style.value,
          class: className.value,
          to: props.to,
          ariaCurrent: props.ariaCurrent,
        },
        { default: slots.default },
      )
  },
})
