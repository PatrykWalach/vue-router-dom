import { defineComponent, h } from 'vue'
import { useHistory } from '../hooks/useHistory'

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
      type: String,
    },
  },
  setup(props, { slots }) {
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
