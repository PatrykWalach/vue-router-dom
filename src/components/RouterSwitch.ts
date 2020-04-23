import { computed, defineComponent } from 'vue'

import { matchPath } from '../api/matchPath'
import { useLocation } from '../hooks/useLocation'
import { LocationDescriptorObject } from 'history'

export interface RouterSwitchProps {
  location: LocationDescriptorObject | null
}

export const RouterSwitch = defineComponent({
  name: 'RouterSwitch',
  props: { location: { default: null, required: false, type: null } },
  setup(props: Readonly<RouterSwitchProps>, { slots }) {
    const location = useLocation()
    const pathname = computed(() => props.location && props.location.pathname)
    const matchPathname = computed(
      () => pathname.value || location.value.pathname,
    )

    return () => {
      const matchPathnameValue = matchPathname.value
      const slotsDefault = slots.default

      return (
        slotsDefault &&
        slotsDefault().find(({ props }) => {
          const { path = '', from = '', exact = false, strict = false } =
            props || {}

          return matchPath(matchPathnameValue, {
            exact,
            path: path || from,
            strict,
          })
        })
      )
    }
  },
})
