import { defineComponent, watchEffect } from 'vue'
import { Path } from 'history'
import { useHistory } from '../hooks/useHistory'

export interface RouterRedirectProps {
  to: Path | string
}

export const RouterRedirect = defineComponent({
  props: { to: { default: '', required: true, type: [Object, String] } },
  setup(props: Readonly<RouterRedirectProps>) {
    const history = useHistory()
    watchEffect(() => {
      history.push(props.to)
    })
    return () => null
  },
})
