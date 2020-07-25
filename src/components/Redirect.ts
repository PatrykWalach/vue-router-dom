import { defineComponent, toRefs } from 'vue'
import { useRedirect } from '../hooks/useRedirect'

import { To } from 'history'

export interface RedirectProps {
  to: To
  push: boolean
  exact: boolean
  strict: boolean
  from: string
  sensitive: boolean
}

export const Redirect = defineComponent({
  name: 'Redirect',

  props: {
    to: { default: '', required: true, type: [Object, String] },
    push: {
      default: false,
      required: false,
      type: Boolean,
    },
    from: { default: '', required: false, type: String },
    exact: {
      default: false,
      required: false,
      type: Boolean,
    },
    strict: {
      default: false,
      required: false,
      type: Boolean,
    },
    sensitive: {
      default: false,
      required: false,
      type: Boolean,
    },
  },

  setup(props: Readonly<RedirectProps>) {
    const { from, to, push, strict, exact, sensitive } = toRefs(props)

    useRedirect(
      () => ({
        path: from.value,
        strict: strict.value,
        exact: exact.value,
        sensitive: sensitive.value,
      }),
      to,
      push,
    )

    return () => null
  },
})
