import { defineComponent } from 'vue'
import { testPath } from '../hooks/useRouteMatch'
import { useLocation } from '../hooks/useLocation'

export const RouterSwitch = defineComponent({
  setup(_, { slots }) {
    const location = useLocation()

    return () =>
      slots.default().find(({ props }) => {
        const path = (props && props.path) || ''
        return testPath(path, location.value.pathname)
      })
  },
})
