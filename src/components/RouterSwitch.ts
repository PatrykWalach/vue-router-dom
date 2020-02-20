import { defineComponent } from 'vue'
import { parsePath } from '../hooks/useRouteMatch'
import { useLocation } from '../hooks/useLocation'

const testPath = (path: string, pathname: string) =>
  RegExp(parsePath(path)).test(pathname)

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
