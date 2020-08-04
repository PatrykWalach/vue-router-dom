import { defineComponent, h, computed, watch } from 'vue'
import { Router } from './Router'
import { useReducer } from '../utils/useReducer'
import { Update, createBrowserHistory } from 'history'

export interface BrowserRouterProps {
  window?: Window
}

export const BrowserRouter = defineComponent({
  name: 'BrowserRouter',

  props: { window: { required: false, type: Object } as any },

  setup(props: Readonly<BrowserRouterProps>, { slots }) {
    const history = computed(() =>
      createBrowserHistory({
        window: props.window,
      }),
    )

    const [state, dispatch] = useReducer(
      (state, { action, location }: Update) => {
        state.action = action
        state.location = location
      },
      {
        action: history.value.action,
        location: history.value.location,
      },
    )

    watch(history, (history) => history.listen(dispatch), {
      flush: 'sync',
      immediate: true,
    })

    return () =>
      h(
        Router,
        {
          location: state.location,
          action: state.action,
          navigator: history.value,
        },
        { default: slots.default },
      )
  },
})
