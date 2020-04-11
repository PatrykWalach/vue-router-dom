import VueRouterDom, { RouterRedirect } from '../../src'
import { createMemoryHistory } from 'history'
import { h } from 'vue'
import { mount } from './utils'

describe('RouterRedirect()', () => {
  it('works with MemoryRouter', () => {
    const history = createMemoryHistory()
    const to = '/home'
    const App = () => h(RouterRedirect, { to })

    mount(App, (app) => app.use(VueRouterDom, history))

    expect(history.location.pathname).toStrictEqual(to)
  })
})
