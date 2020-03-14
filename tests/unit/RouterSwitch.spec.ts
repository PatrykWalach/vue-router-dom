import { VNode, h } from 'vue'
import VueRouterDom, { RouterSwitch } from '../../src'
import { createMemoryHistory } from 'history'
import { mount } from './utils'

const testSwitch = (
  defaultSlot: (fn: jest.Mock<any, any>) => () => VNode[] | VNode,
  pathname = '/',
) => {
  const history = createMemoryHistory()

  history.push(pathname)

  const fn = jest.fn()

  const App = {
    setup() {
      return () => h(RouterSwitch, defaultSlot(fn))
    },
  }

  mount(App, app => app.use(VueRouterDom, history))
  return fn
}

const createTestComponent = (fn: jest.Mock<any, any>, props: any) =>
  h(() => {
    fn()
    return null
  }, props)

const createTestRoute = (props?: any) => (fn: jest.Mock<any, any>) => () =>
  createTestComponent(fn, props)

describe('RouterSwitch', () => {
  it(`works with from`, () => {
    const fn = testSwitch(createTestRoute({ from: '' }))
    expect(fn).toBeCalled()
  })
  it(`works with path`, () => {
    const fn = testSwitch(createTestRoute({ path: '' }))
    expect(fn).toBeCalled()
  })
  it(`works with no props`, () => {
    const fn = testSwitch(createTestRoute())
    expect(fn).toBeCalled()
  })
})
