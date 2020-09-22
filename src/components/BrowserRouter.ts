import { defineComponent, h, computed, PropType } from 'vue'
import { Router } from './Router'
import { createBrowserHistory } from 'history'
import { useRouter } from '../utils/useRouter'

export const BrowserRouter = defineComponent({
  name: 'BrowserRouter',

  props: {
    window: {
      required: false,
      type: Object as PropType<Window>,
    },
  },

  setup(props, { slots }) {
    const history = computed(() => createBrowserHistory(props))

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
