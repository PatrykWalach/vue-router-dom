import { defineComponent, computed, renderSlot, h } from 'vue'
import { useRoutes_ } from '../hooks/useRoutes'
import { createRoutesFromChildren } from '../api/createRoutesFromChildren'

export const Routes = defineComponent({
  name: 'Routes',

  props: { basename: { default: '', required: false, type: String } },

  setup(props, { slots }) {
    const routes = computed(() =>
      createRoutesFromChildren([renderSlot(slots, 'default')]),
    )

    const component = useRoutes_(routes, () => props.basename)

    return () => h(component.value)
  },
})
