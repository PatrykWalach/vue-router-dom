import { defineComponent } from 'vue'
import { useRegisterParams } from '../hooks/useParams'
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
    // next line might be moved into useRouteMatch before useParams call
    useRegisterParams(() => props.path)
    const match = useRouteMatch(() => props.path)

    return () => match.value && slots.default(match.value)
  },
})
