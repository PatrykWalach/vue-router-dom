import { defineComponent, toRef } from 'vue'
import { matchPath } from '../api/matchPath'

import { PartialLocation } from 'history'
import { useLocationPath } from '../utils/useLocationPath'

export interface SwitchProps {
  location: Partial<PartialLocation>
}

export const Switch = defineComponent({
  name: 'Switch',

  props: { location: { default: () => ({}), required: false, type: Object } },

  setup(props: Readonly<SwitchProps>, { slots }) {
    const propsLocation = toRef(props, 'location')

    const pathname = useLocationPath(propsLocation)

    return () => {
      const pathnameValue = pathname.value
      const slotsDefault = slots.default

      if (!slotsDefault) {
        return null
      }

      return slotsDefault(props).find(({ props }) => {
        const { path = '', from = '', exact = false, strict = false } =
          props || {}

        return matchPath(pathnameValue, {
          exact,
          path: path || from,
          strict,
        })
      })
    }
  },
})
