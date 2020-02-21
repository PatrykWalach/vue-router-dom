import { defineComponent, h } from 'vue'
import { matchPath } from '../matchPath'
import { useLocation } from '../hooks/useLocation'

export const RouterSwitch = defineComponent({
  props: { exact: { default: false, required: false, type: Boolean } },
  setup(props, { slots }) {
    const location = useLocation()

    return () =>
      h(
        'div',
        slots.default().find(vm => {
          const path = (vm.props && vm.props.path) || ''
          return matchPath(location.value.pathname, {
            exact: props.exact,
            path,
          })
        }),
      )
  },
})
