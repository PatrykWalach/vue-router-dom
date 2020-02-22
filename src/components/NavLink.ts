import { HashLocation, Location, Path } from 'history'
import { computed, defineComponent, h } from 'vue'
import { RouterLink } from './RouterLink'
import { RouterMatch } from '../types'
import { useLocation } from '../hooks/useLocation'
import { useRouteMatch } from '../hooks/useRouteMatch'

export interface NavLinkProps {
  activeClassName: string
  activeStyle: Record<string, string>
  exact: boolean
  isActive(
    match: RouterMatch | null,
    location: Location | HashLocation,
  ): boolean
  strict: boolean
  to: Path | string | ((location: Location | HashLocation) => Path | string)
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
    exact: { default: false, required: false, type: Boolean },
    isActive: {
      default: () => Boolean,
      required: false,
      type: null,
    },
    strict: { default: false, required: false, type: Boolean },
    to: { default: '', required: true, type: [String, Object, Function] },
  },
  setup(props: Readonly<NavLinkProps>, { slots }) {
    const location = useLocation()

    const path = computed(() => {
      const to =
        props.to instanceof Function ? props.to(location.value) : props.to
      const path = to instanceof Object ? to.pathname : to
      return path
    })

    const match = useRouteMatch(() => ({
      exact: props.exact,
      path: path.value,
      strict: props.strict,
    }))

    const active = computed(() => props.isActive(match.value, location.value))

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
