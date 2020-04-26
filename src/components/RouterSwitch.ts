import { computed, defineComponent } from 'vue'

import { matchPath } from '../api/matchPath'
import { useRoute } from '../hooks/useRoute'
import { RouterRouteDescriptor } from '../api/types'

export interface RouterSwitchProps {
  route: Partial<RouterRouteDescriptor>
}

export const RouterSwitch = defineComponent({
  name: 'RouterSwitch',
  props: { route: { default: () => {}, required: false, type: Object } },
  setup(props: Readonly<RouterSwitchProps>, { slots }) {
    const route = useRoute()
    const pathname = computed(() => props.route.path)
    const matchPathname = computed(() => pathname.value || route.value.path)

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
