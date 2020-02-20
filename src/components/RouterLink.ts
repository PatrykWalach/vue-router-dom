import { defineComponent, h } from 'vue'
import { useHistory } from '../hooks/useHistory'

export const RouterLink = defineComponent({
  props: {
    to: {
      default: '',
      required: true,
      type: String,
    },
  },
  setup(props, { slots }) {
    const history = useHistory()

    return () =>
      h(
        'a',
        {
          href: props.to,
          onClick(event: MouseEvent) {
            event.stopPropagation()
            event.preventDefault()
            history.push(props.to)
          },
        },
        slots.default(),
      )
  },
})
