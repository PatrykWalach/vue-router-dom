import { defineComponent } from 'vue'
import { useRouteMatch } from '../hooks/useRouteMatch'

export interface RouterRouteProps {
  exact: boolean
  path: string
}

export const RouterRoute = defineComponent({
  name: 'RouterRoute',
  props: {
    exact: { default: false, required: false, type: Boolean },
    path: {
      default: '',
      // require path for RouterSwitch to work
      required: true,
      type: String,
    },
  },
  setup(props: Readonly<RouterRouteProps>, { slots }) {
    const match = useRouteMatch(() => props)

    return () => match.value && slots.default(match.value)
  },
})
