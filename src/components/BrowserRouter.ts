import { ROUTER_HISTORY, ROUTER_LOCATION } from '../keys'
import { defineComponent, provide, readonly, ref } from 'vue'
import { RouterLocation } from '../types'

const getLocation = (): RouterLocation => ({
  hash: window.location.hash,
  pathname: window.location.pathname,
  search: window.location.search,
})

export const BrowserRouter = defineComponent({
  setup(_, { slots }) {
    const location = ref(getLocation())

    const push = (newPath: string) => {
      history.pushState('', '', newPath)
      location.value = getLocation()
    }

    provide(ROUTER_LOCATION, readonly(location))
    provide(ROUTER_HISTORY, {
      push,
    })

    return slots.default
  },
})
