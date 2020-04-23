import VueRouterDom, {
  RouterRedirect,
  createMemoryHistory,
  MemoryHistory,
} from '../../src'
import { h, createApp } from 'vue'
import { mount } from './utils'

describe('RouterRedirect()', () => {
  let history: MemoryHistory<{}>
  beforeEach(() => {
    history = createMemoryHistory()
  })

  it('works with MemoryRouter', () => {
    const to = '/home'

    const App = () => h(RouterRedirect, { to })

    const app = createApp(App).use(VueRouterDom, history)
    mount(app)

    expect(history.location.pathname).toStrictEqual(to)
  })
})
