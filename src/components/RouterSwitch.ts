import { Path } from 'history'
import { defineComponent } from 'vue'
import { matchPath } from '../matchPath'
import { useLocation } from '../hooks/useLocation'

export interface RouterSwitchProps {
  location: Path
}

export const RouterSwitch = defineComponent({
  name: 'RouterSwitch',
  props: { location: { default: null, required: false, type: null } },
  setup(switchProps: Readonly<RouterSwitchProps>, { slots }) {
    const location = useLocation()

    return () =>
      slots.default().find(({ props }) => {
        const path = (props && (props.path || props.from)) || ''
        const exact = (props && props.exact) || false
        const strict = (props && props.strict) || false
        return matchPath(
          switchProps.location.pathname && location.value.pathname,
          {
            exact,
            path,
            strict,
          },
        )
      })
  },
})
