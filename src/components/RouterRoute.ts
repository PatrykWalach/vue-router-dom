import { defineComponent } from 'vue'
import { useRouteMatch } from '../hooks/useRouteMatch'

export interface RouterRouteProps {
  exact: boolean
  strict: boolean
  path: string
}

export const RouterRoute = defineComponent({
  name: 'RouterRoute',
  props: {
    exact: { default: false, required: false, type: Boolean },
    path: {
      default: '',
      required: false,
      type: String,
    },
    strict: { default: false, required: false, type: Boolean },
  },
  setup(props: Readonly<RouterRouteProps>, { slots }) {
    const match = useRouteMatch(() => props)

    return () => match.value && slots.default(match.value)
  },
})
