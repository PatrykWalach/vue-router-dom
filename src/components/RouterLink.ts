import { HashLocation, Path } from 'history'
import { computed, defineComponent, h } from 'vue'
import { useHistory } from '../hooks/useHistory'

export interface RouterLinkProps {
  to: Path | string | ((location: Location | HashLocation) => Path | string)
  tag: string
  replace: boolean
}

export const RouterLink = defineComponent({
  name: 'RouterLink',
  props: {
    replace: {
      default: false,
      required: false,
      type: Boolean,
    },
    tag: {
      default: 'a',
      required: false,
      type: String,
    },
    to: { default: '', required: true, type: [String, Object, Function] },
  },
  setup(props: Readonly<RouterLinkProps>, { slots }) {
    const history = useHistory()

    const to = computed(() =>
      props.to instanceof Function ? props.to(location) : props.to,
    )

    const onClick = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      ;(props.replace ? history.replace : history.push)(to.value)
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
