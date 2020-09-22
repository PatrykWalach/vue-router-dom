import { defineComponent, computed, h, PropType } from 'vue'
import { createMemoryHistory, InitialEntry } from 'history'
import { Router } from './Router'
import { useRouter } from '../utils/useRouter'

export const MemoryRouter = defineComponent({
  name: 'MemoryRouter',

  props: {
    initialEntries: {
      required: false,
      type: Array as PropType<InitialEntry[]>,
    },
    initialIndex: { required: false, type: Number },
  },

  setup(props, { slots }) {
    const history = computed(() => createMemoryHistory(props))

    const state = useRouter(history)

    return () =>
      h(
        Router,
        {
          ...state,
          navigator: history.value,
        },
        { default: slots.default },
      )
  },
})
