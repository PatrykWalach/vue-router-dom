import { defineComponent, computed, renderSlot } from 'vue'
import { useRoutes_ } from '../hooks/useRoutes'
import { createRoutesFromChildren } from '../api/createRoutesFromChildren'

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

    const vnode = useRoutes_(routes, () => props.basename)

    return () => vnode.value
  },
})
