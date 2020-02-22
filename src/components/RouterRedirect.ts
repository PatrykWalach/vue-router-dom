import { defineComponent, watchEffect } from 'vue'
import { useHistory } from '../hooks/useHistory'

export const RouterRedirect = defineComponent({
  props: { to: [Object, String] },
  setup(props) {
    const history = useHistory()
    watchEffect(() => {
      history.push(props.to)
    })
    return () => null
  },
})
