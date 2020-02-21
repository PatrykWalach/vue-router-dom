import { defineComponent } from 'vue'
import { matchPath } from '../matchPath'
import { useLocation } from '../hooks/useLocation'

export const RouterSwitch = defineComponent({
  setup(_, { slots }) {
    const location = useLocation()

    return () =>
      // h(
      //   'div',
      slots.default().find(({ props }) => {
        const path = (props && props.path) || ''
        return matchPath(location.value.pathname, {
          path: path,
        })
      })
    // ,
    // )
  },
})
