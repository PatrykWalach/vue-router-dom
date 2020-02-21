import { defineComponent } from 'vue'
import { useRegisterParams } from '../hooks/useParams'
import { useRouteMatch } from '../hooks/useRouteMatch'

export const RouterRoute = defineComponent({
  props: {
    path: {
      default: null,
      required: true,
      type: String,
    },
  },
  setup(props, { slots }) {
    useRegisterParams(() => props.path)
    const match = useRouteMatch(() => props.path)

    return () => {
      return match.value && slots.default(match.value)
    }
  },
})
