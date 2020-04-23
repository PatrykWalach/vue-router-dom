import { PathFunction, resolvePath } from '../utils/resolvePath'
import { computed, defineComponent, h } from 'vue'
import { RouterPath } from '../api/types'
import { useHistory } from '../hooks/useHistory'
import { useLocation } from '../hooks/useLocation'

export interface RouterLinkProps {
  to: RouterPath | string | PathFunction
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
    const history = useHistory()
    const location = useLocation()

    const to = computed(() => resolvePath(props.to, location.value))

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
        slots.default && slots.default(),
      )
  },
})
