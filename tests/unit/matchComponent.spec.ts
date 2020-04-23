import { createApp } from 'vue'
import { matchComponent } from '../../src/utils/matchComponent'
import { mount } from './utils'
describe('matchPaths()', () => {
  let fn: jest.Mock<any, any>
  const USER_SETTINGS = '/user/settings'
  const POST = (postId = ':postId') => `/post/${postId}`

  const Route = (props: any) => (fn(props), null)

  const routes = {
    [USER_SETTINGS]: Route,
    [POST()]: Route,
  }

  beforeEach(() => {
    fn = jest.fn()
  })

  it(`returns Component if no match`, () => {
    const Component = matchComponent(routes, null)
    mount(createApp(Component))
    expect(fn).not.toBeCalled()
  })

  it(`returns Component if match`, () => {
    const Component = matchComponent(routes, {
      path: USER_SETTINGS,
      isExact: true,
      params: {},
      url: USER_SETTINGS,
    })
    mount(createApp(Component))
    expect(fn).toBeCalled()
  })

  it(`returns match`, () => {
    const postId = '17'
    const match = {
      path: POST(),
      isExact: true,
      url: POST(postId),
      params: {
        postId,
      },
    }
    const Component = matchComponent(routes, match)
    mount(createApp(Component))
    expect(fn).toBeCalledWith(match)
  })
})
