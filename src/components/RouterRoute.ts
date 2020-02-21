import { defineComponent } from 'vue'
import { useRouteMatch } from '../hooks/useRouteMatch'

export const RouterRoute = defineComponent({
  props: {
    path: {
      default: null,
      // require path for RouterSwitch to work
      required: true,
      type: String,
    },
  },
  setup(props, { slots }) {
    const match = useRouteMatch(() => props.path)

    return () => match.value && slots.default(match.value)
  },
})
