import { HashHistoryOptions, createHashHistory } from 'history'
import { defineComponent, h } from 'vue'
import { BaseRouter } from './BaseRouter'

export const HashRouter = defineComponent({
  name: 'HashRouter',
  setup(props: Readonly<HashHistoryOptions>, { slots }) {
    const history = createHashHistory(props)

    return () => h(BaseRouter, { history }, slots.default())
  },
})
