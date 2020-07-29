import { defineComponent, h, toRefs } from 'vue'
import { useLocation } from '../hooks/useLocation'
import { useNavigate } from '../hooks/useNavigate'

import { To, State, createPath } from 'history'
import { useResolvedPath } from '../utils/useResolvedPath'
import { useHref } from '../utils/useHref'

export interface LinkProps {
  state: State
  replace: boolean
  to: To
  tag: string
}

export const Link = defineComponent({
  name: 'Link',

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
    to: { default: '', required: true, type: [String, Object] },
    state: { default: undefined, required: false, type: Object },
  },

  emits: { click: null },

  setup(props: Readonly<LinkProps>, { slots, emit }) {
    const { to, replace } = toRefs(props)
    const href = useHref(to)
    const location = useLocation()
    const path = useResolvedPath(to)

    const navigate = useNavigate()

    const handleClick = (event: MouseEvent) => {
      emit('click', event)
      event.stopPropagation()
      event.preventDefault()

      const pathValue = path.value

      // If the URL hasn't changed, replace instead of push.
      const replaceValue =
        !!replace.value || createPath(location.value) === createPath(pathValue)

      navigate(pathValue, {
        replace: replaceValue,
        state: props.state,
      })
    }

    return () =>
      h(
        props.tag,
        {
          href: href.value,
          onClick: handleClick,
        },
        { default: slots.default },
      )
  },
})
