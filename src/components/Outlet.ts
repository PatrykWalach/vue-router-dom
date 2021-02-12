import { defineComponent, h } from 'vue'
import { useOutlet } from '../hooks/useOutlet'

export const Outlet = defineComponent({
  name: 'Outlet',

  setup() {
    const outletComponent = useOutlet()

    return () => h(outletComponent.value)
  },
})
