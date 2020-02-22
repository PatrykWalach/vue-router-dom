import {
  BrowserHistory,
  HashHistory,
  MemoryHistory,
  createBrowserHistory,
} from 'history'
import { ROUTER_HISTORY, ROUTER_LOCATION } from '../keys'
import { defineComponent, provide, readonly, ref, watch } from 'vue'

interface Props {
  history: MemoryHistory | HashHistory | BrowserHistory
}

export const BaseRouter = defineComponent({
  name: 'BaseRouter',
  props: {
    history: { default: createBrowserHistory, required: true, type: null },
  },
  setup(props: Readonly<Props>, { slots }) {
    const location = ref(props.history.location)

    watch(
      () => props.history,
      (history, prevHistory, onCleanup) => {
        const unlisten = history.listen(newLocation => {
          location.value = newLocation
        })

        onCleanup(unlisten)
      },
      { immediate: true },
    )

    provide(ROUTER_LOCATION, readonly(location))
    provide(ROUTER_HISTORY, props.history)

    return slots.default
  },
})
