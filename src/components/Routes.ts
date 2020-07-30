import { defineComponent, computed, renderSlot } from 'vue'
import { useRoutes } from '../hooks/useRoutes'
import { createRoutesFromChildren } from '../utils/createRoutesFromChildren'

export interface RoutesProps {
  basename: string
}

export const Routes = defineComponent({
  name: 'Routes',

  props: { basename: { default: '', required: false, type: String } },

  setup(props: Readonly<RoutesProps>, { slots }) {
    const routes = computed(() =>
      createRoutesFromChildren([renderSlot(slots, 'default')]),
    )

    const vnode = useRoutes(routes, () => props.basename)

    return () => vnode.value
  },
})
