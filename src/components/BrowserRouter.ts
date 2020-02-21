import { BrowserHistoryOptions, createBrowserHistory } from 'history'
import { defineComponent, h } from 'vue'
import { BaseRouter } from './BaseRouter'

export const BrowserRouter = defineComponent({
  setup(props: Readonly<BrowserHistoryOptions>, { slots }) {
    const history = createBrowserHistory(props)

    return () => h(BaseRouter, { history }, slots.default())
  },
})
