import { MemoryHistoryOptions, createMemoryHistory } from 'history'
import { defineComponent, h } from 'vue'
import { BaseRouter } from './BaseRouter'

export const MemoryRouter = defineComponent({
  name: 'MemoryRouter',
  setup(props: Readonly<MemoryHistoryOptions>, { slots }) {
    const history = createMemoryHistory(props)

    return () => h(BaseRouter, { history }, slots.default)
  },
})
