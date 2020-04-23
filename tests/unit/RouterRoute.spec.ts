import VueRouterDom, {
  createMemoryHistory,
  RouterParams,
  RouterRoute,
} from '../../src'

import { h, createApp } from 'vue'
import { mount } from './utils'

const testMatch = (path: string, pathname = '/', exact = false) => {
  const history = createMemoryHistory()

  history.push(pathname)

  const fn = jest.fn()

  const App = () =>
    h(
      RouterRoute,
      { exact, path },
      {
        default: (props: RouterParams) => {
          fn(props)
          return null
        },
      },
    )

  const app = createApp(App).use(VueRouterDom, history)
  mount(app)

  return fn
}

describe('RouterRoute', () => {
  it('does not render for no match', () => {
    const fn = testMatch('/home', '/settings')
    expect(fn).not.toBeCalled()
  })

  it('has slot props', () => {
    const fn = testMatch('/home', '/home')
    expect(fn).lastCalledWith(expect.any(Object))
  })

  it('renders for a match', () => {
    const fn = testMatch('/home', '/home')
    expect(fn).toBeCalled()
  })
})
