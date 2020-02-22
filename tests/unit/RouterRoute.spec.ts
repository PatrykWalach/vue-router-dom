import { RouterParams, RouterRoute } from '../../src'
import { BaseRouter } from '../../src/components/BaseRouter'
import { createMemoryHistory } from 'history'
import { h } from 'vue'
import { mount } from './utils'

const testMatch = (path: string, pathname = '/', exact = false) => {
  const history = createMemoryHistory()

  history.push(pathname)

  const fn = jest.fn()

  mount({
    setup() {
      return () =>
        h(BaseRouter, { history }, () =>
          h(
            RouterRoute,
            { exact, path },
            {
              default: (props: RouterParams) => {
                fn(props)
                return null
              },
            },
          ),
        )
    },
  })
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
