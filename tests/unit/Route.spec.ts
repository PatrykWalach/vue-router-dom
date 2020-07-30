import { Routes, Route } from '../../src'

import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { ROUTER_HISTORY, createMemoryHistory } from '../../src'

import { MemoryHistory, State } from '../../src'

describe('A <Route>', () => {
  let history: MemoryHistory<State>

  beforeEach(() => {
    history = createMemoryHistory()
  })

  it('renders its `element` prop', () => {
    history.push('/home')

    const Home = () => h('h1', 'Home')

    const wrapper = mount(
      {
        render: () =>
          h(Routes, () => h(Route, { path: '/home', element: h(Home) })),
      },
      {
        global: {
          provide: {
            [ROUTER_HISTORY as symbol]: history,
          },
        },
      },
    )

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Home</h1>"`)
  })

  it('renders its child routes when no `element` prop is given', () => {
    history.push('/app/home')

    const Home = () => h('h1', 'Home')

    const wrapper = mount(
      {
        render: () =>
          h(Routes, () =>
            h(Route, { path: 'app' }, () => [
              h(Route, { path: 'home', element: h(Home) }),
            ]),
          ),
      },
      {
        global: {
          provide: {
            [ROUTER_HISTORY as symbol]: history,
          },
        },
      },
    )

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Home</h1>"`)
  })
})
