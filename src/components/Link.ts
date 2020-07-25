import { PathFunction, useResolvePath } from '../utils/resolvePath'
import { defineComponent, h, toRefs, Component } from 'vue'
import { useHistoryReplace } from '../utils/historyReplace'
import { useLocation } from '../hooks/useLocation'
import { useLocationToHref } from '../utils/useLocationToHref'

import { To } from 'history'

export interface LinkProps {
  to: To | PathFunction
  tag: string
  replace: boolean
  component: Component
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
    to: { default: '', required: true, type: [String, Object, Function] },
    component: { default: null, required: false, type: [Object, Function] },
  },

  setup(props: Readonly<LinkProps>, { slots }) {
    const location = useLocation()
    const { to, replace } = toRefs(props)
    const nextLocation = useResolvePath(to, location)
    const historyGo = useHistoryReplace(replace)

    const href = useLocationToHref(nextLocation)

    const handleClick = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      historyGo.value(nextLocation.value)
    }

    return () =>
      h(
        props.component || props.tag,
        {
          href: href.value,
          onClick: handleClick,
        },
        { default: slots.default },
      )
  },
})
