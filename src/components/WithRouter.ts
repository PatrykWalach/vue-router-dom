import { defineComponent } from 'vue'
import { useLocation } from '../hooks/useLocation'
import { useHistory } from '../hooks/useHistory'

export const WithRouter = defineComponent({
  name: 'WithRouter',

  setup(_, { slots }) {
    // const match = useMatch()
    const history = useHistory()
    const location = useLocation()

    return () =>
      slots.default && slots.default({ location: location.value, history })
  },
})
