import { PathFunction, useResolvePath } from '../utils/resolvePath'
import { defineComponent, h } from 'vue'
import { To } from 'history'
import { useHistoryReplace } from '../utils/historyReplace'
import { useLocation } from '../hooks/useLocation'

export interface RouterLinkProps {
  to: To | PathFunction
  tag: string
  replace: boolean
}

export const RouterLink = defineComponent({
  name: 'RouterLink',
  props: {
    replace: {
      default: false,
      required: false,
      // type: Boolean,
    },
    tag: {
      default: 'a',
      required: false,
      type: String,
    },
    to: { default: '', required: true, type: [String, Object, Function] },
  },
  setup(props: Readonly<RouterLinkProps>, { slots }) {
    const location = useLocation()

    const to = useResolvePath(() => props.to, location)
    const historyGo = useHistoryReplace(() => props.replace)

    const onClick = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      historyGo.value(to.value)
    }

    return () =>
      h(
        props.tag,
        {
          href: props.to,
          onClick,
        },
        slots.default && slots.default(),
      )
  },
})
