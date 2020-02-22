import { defineComponent, h } from 'vue'
import { Path } from 'history'
import { useHistory } from '../hooks/useHistory'

export interface RouterLinkProps {
  to: Path | string
  tag: string
}

export const RouterLink = defineComponent({
  name: 'RouterLink',
  props: {
    tag: {
      default: 'a',
      required: false,
      type: String,
    },
    to: {
      default: '',
      required: true,
      type: [String, Object],
    },
  },
  setup(props: Readonly<RouterLinkProps>, { slots }) {
    const history = useHistory()

    const onClick = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      history.push(props.to)
    }

    return () =>
      h(
        props.tag,
        {
          href: props.to,
          onClick,
        },
        slots.default(),
      )
  },
})
