import {
  BrowserHistory,
  HashHistory,
  MemoryHistory,
  createBrowserHistory,
} from 'history'
import { ROUTER_HISTORY, ROUTER_LOCATION } from '../keys'
import { defineComponent, onBeforeUnmount, provide, readonly, ref } from 'vue'

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

    const unlisten = props.history.listen(newLocation => {
      location.value = newLocation
    })

    onBeforeUnmount(unlisten)

    provide(ROUTER_LOCATION, readonly(location))
    provide(ROUTER_HISTORY, props.history)

    return slots.default
  },
})
