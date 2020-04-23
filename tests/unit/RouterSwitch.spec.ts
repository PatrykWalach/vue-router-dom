import { h, createApp } from 'vue'
import VueRouterDom, { createMemoryHistory, MemoryHistory } from '../../src'
import { RouterSwitch } from '../../src/components/RouterSwitch'

import { mount } from './utils'

describe('RouterSwitch', () => {
  let fn: jest.Mock<any, any>
  let history: MemoryHistory<{}>

  beforeEach(() => {
    fn = jest.fn()
    history = createMemoryHistory()
  })

  const App = (props?: { from?: string; path?: string }) => () =>
    h(RouterSwitch, () =>
      h(() => {
        fn()
        return null
      }, props),
    )

  it(`works with from`, () => {
    const app = createApp(App({ from: '' })).use(VueRouterDom, history)
    mount(app)
    expect(fn).toBeCalled()
  })
  it(`works with path`, () => {
    const app = createApp(App({ path: '' })).use(VueRouterDom, history)
    mount(app)
    expect(fn).toBeCalled()
  })
  it(`works with no props`, () => {
    const app = createApp(App()).use(VueRouterDom, history)
    mount(app)
    expect(fn).toBeCalled()
  })
})
