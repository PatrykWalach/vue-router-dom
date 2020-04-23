import { createApp } from 'vue'

import { RouterMatch } from '../../src'
import { matchPaths } from '../../src/hooks/useRoutes'
import { mount } from './utils'

type PostMatch = RouterMatch<{ postId: string }>

describe('matchPaths()', () => {
  let fn: jest.Mock<any, any>
  const USER_SETTINGS = '/user/settings'
  const POST = '/post'
  const routes = {
    [USER_SETTINGS]() {
      fn(USER_SETTINGS)
      return null
    },
    [`${POST}/:postId`]({ params }: PostMatch) {
      fn(params.postId)
      return null
    },
  }

  beforeEach(() => {
    fn = jest.fn()
  })
  it(`returns Component`, () => {
    const Component = matchPaths(routes, POST)
    expect(Component).toBeInstanceOf(Function)
  })
  it(`returns Component if no match`, () => {
    const Component = matchPaths(routes, '/no-match')
    expect(fn).not.toBeCalled()
    expect(Component).toBeInstanceOf(Function)
  })

  it(`matches first path`, () => {
    const Component = matchPaths(routes, USER_SETTINGS)
    mount(createApp(Component))
    expect(fn).toBeCalledWith(USER_SETTINGS)
  })
  it(`returns params`, () => {
    const postId = '17'
    const Component = matchPaths(routes, `${POST}/${postId}`)
    mount(createApp(Component))
    expect(fn).toBeCalledWith(postId)
  })
})
