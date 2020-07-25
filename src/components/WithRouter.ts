import { defineComponent } from 'vue'
import { useLocation } from '../hooks/useLocation'
import { useHistory } from '../hooks/useHistory'
import { useMatch } from '../hooks/useMatch'

export const WithRouter = defineComponent({
  name: 'WithRouter',

  setup(_, { slots }) {
    const match = useMatch()
    const history = useHistory()
    const location = useLocation()

    return () =>
      slots.default &&
      slots.default({ match: match.value, location: location.value, history })
  },
})
