import { computed, defineComponent } from 'vue'

import { useLocation } from '../hooks/useLocation'
import { PartialLocation } from 'history'

export interface RouterSwitchProps {
  location: Partial<PartialLocation>
}

export const RouterSwitch = defineComponent({
  name: 'RouterSwitch',
  props: { location: { default: () => ({}), required: false, type: Object } },
  setup(props: Readonly<RouterSwitchProps>, { slots }) {
    const location = useLocation()
    const pathname = computed(() => props.location.pathname)
    const matchPathname = computed(
      () => pathname.value || location.value.pathname,
    )

    return () => {
      const slotsDefault = slots.default
      return slotsDefault && slotsDefault().shift()
    }
    // return () => {
    //   const matchPathnameValue = matchPathname.value
    //   const slotsDefault = slots.default

    //   return (
    //     slotsDefault &&
    //     slotsDefault().find(({ props }) => {
    //       const { path = '', from = '', exact = false, strict = false } =
    //         props || {}

    //       return matchPath(matchPathnameValue, {
    //         exact,
    //         path: path || from,
    //         strict,
    //       })
    //     })
    //   )
    // }
  },
})
