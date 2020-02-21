import { defineComponent } from 'vue'
import { useRouteMatch } from '../hooks/useRouteMatch'

export const RouterRoute = defineComponent({
  props: {
    exact: { default: false, required: false, type: Boolean },
    path: {
      default: null,
      // require path for RouterSwitch to work
      required: true,
      type: String,
    },
  },
  setup(props, { slots }) {
    const match = useRouteMatch(() => props)

    return () => match.value && slots.default(match.value)
  },
})
