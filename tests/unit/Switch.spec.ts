import { defineComponent, nextTick, h } from 'vue'
import {
  createMemoryHistory,
  MemoryHistory,
  State,
  ROUTER_HISTORY,
  Route,
} from '../../src'
import { Switch } from '../../src/components/Switch'
import { Redirect } from '../../src/components/Redirect'
import { mount } from '@vue/test-utils'
// import { mount } from './utils'

describe('Switch', () => {
  let fn: jest.Mock<any, any>
  let history: MemoryHistory<State>

  beforeEach(() => {
    fn = jest.fn()
    history = createMemoryHistory()
  })

  const App = defineComponent({
    components: { Switch, Route, Redirect },
    props: ['location'],
    template: `
    <Switch :location="location">
      <Route key="about" path="/about">
        <div>About</div>
      </Route>
      <Redirect key="settings" from="/settings" to="/about" />
      <Route key="user" path="/:userId">
        <div>User</div>
      </Route>
      <Route key="home">
        <div>Home</div>
      </Route>
    </Switch>
    `,
  })

  it(`works with Redirect with from`, () => {
    history.push('/settings')

    const wrapper = mount(App, {
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    nextTick(() => {
      expect(wrapper.find('div').text()).toStrictEqual('About')
    })
  })

  it(`works with Route with path`, () => {
    history.push('/about')

    const wrapper = mount(App, {
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.find('div').text()).toStrictEqual('About')
  })

  it(`works with Route without path`, () => {
    const wrapper = mount(App, {
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.find('div').text()).toStrictEqual('Home')

    history.push('/about')

    nextTick(() => {
      expect(wrapper.find('div').text()).toStrictEqual('About')
    })
  })

  it(`works with location object`, () => {
    const wrapper = mount(App, {
      props: { location: { pathname: '/' } },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.find('div').text()).toStrictEqual('Home')

    history.push('/about')

    nextTick(() => {
      expect(wrapper.find('div').text()).toStrictEqual('Home')
    })
  })
})
