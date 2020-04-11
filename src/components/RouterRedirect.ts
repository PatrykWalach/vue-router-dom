import { defineComponent, watch } from 'vue'
import { RouterPath } from 'history'
import { useHistory } from '../hooks/useHistory'

export interface RouterRedirectProps {
  to: RouterPath | string
  push: boolean
  exact: boolean
  strict: boolean
  from: string
}

export const RouterRedirect = defineComponent({
  props: {
    exact: {
      default: false,
      required: false,
      // type: Boolean
    },
    from: { default: '', required: false, type: String },
    push: {
      default: false,
      required: false,
      // type: Boolean
    },
    strict: {
      default: false,
      required: false,
      // type: Boolean
    },
    to: { default: '', required: true, type: [Object, String] },
  },
  setup(props: Readonly<RouterRedirectProps>) {
    const history = useHistory()
    watch(
      () => props.to,
      (to) => {
        ;(props.push ? history.push : history.replace)(to)
      },
      {
        immediate: true,
      },
    )
    return () => null
  },
})
