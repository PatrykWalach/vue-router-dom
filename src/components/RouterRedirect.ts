import { defineComponent } from 'vue'

import { useRedirect } from '../hooks/useRedirect'
import { LocationDescriptor } from 'history'

export interface RouterRedirectProps {
  to: LocationDescriptor
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
      // type: Boolean,
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
    useRedirect(
      () => props.from,
      () => props.to,
      () => props.push,
    )
    return () => null
  },
})
