import { BaseRouter } from '../../src/components/BaseRouter'
import { RouterRedirect } from '../../src'
import { createMemoryHistory } from 'history'
import { h } from 'vue'
import { mount } from './utils'

describe('RouterRedirect()', () => {
  it('works with MemoryRouter', () => {
    const history = createMemoryHistory()
    const to = '/home'
    mount({
      setup() {
        return () => h(BaseRouter, { history }, () => h(RouterRedirect, { to }))
      },
    })
    expect(history.location.pathname).toStrictEqual(to)
  })
})
