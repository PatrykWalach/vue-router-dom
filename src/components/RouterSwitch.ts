import { computed, defineComponent } from 'vue'
import { RouterPath } from 'history'
import { matchPath } from '../api/matchPath'
import { useLocation } from '../hooks/useLocation'

export interface RouterSwitchProps {
  location: RouterPath | null
}

export const RouterSwitch = defineComponent({
  name: 'RouterSwitch',
  props: { location: { default: null, required: false, type: null } },
  setup(props: Readonly<RouterSwitchProps>, { slots }) {
    const location = useLocation()
    const pathname = computed(() => props.location && props.location.pathname)

    return () =>
      slots.default &&
      slots.default().find(({ props }) => {
        const path = (props && (props.path || props.from)) || ''
        const exact = (props && props.exact) || false
        const strict = (props && props.strict) || false
        return matchPath(pathname.value || location.value.pathname, {
          exact,
          path,
          strict,
        })
      })
  },
})
