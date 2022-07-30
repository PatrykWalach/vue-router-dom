import { Routes, Route, Outlet, MemoryRouter } from '../../src'

import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import { useParams } from '../../src'
import { describe, it, expect } from 'vitest'

describe('A <Routes>', () => {
  it('renders the first route that matches the URL', () => {
    const Home = () => h('h1', 'Home')

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, () =>
          h(Routes, {
            routes: [{ path: '/', element: Home }],
          }),
        ),
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('does not render a 2nd route that also matches the URL', () => {
    const Home = () => h('h1', 'Home')
    const Dashboard = () => h('h1', 'Dashboard')

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: ['/home'] }, () =>
          h(Routes, {
            routes: [
              { path: '/home', element: Home },
              { path: '/home', element: Dashboard },
            ],
          }),
        ),
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('<Routes> with a basename', () => {
  const User = defineComponent({
    setup() {
      const params = useParams()

      return () =>
        h('div', [h('h1', `User: ${params.value.userId}`), h(Outlet)])
    },
  })

  const Dashboard = () => h('h1', 'Dashboard')

  const routes = [
    {
      path: 'users/:userId',
      element: User,
      children: [{ path: 'dashboard', element: Dashboard }],
    },
  ]

  it('does not match when the URL pathname does not start with that base', () => {
    const wrapper = mount({
      render: () =>
        h(
          MemoryRouter,
          {
            basename: '/base',
            initialEntries: ['/app/users/michael/dashboard'],
          },
          () => h(Routes, { routes: routes }),
        ),
    })

    expect(wrapper.html()).toMatchInlineSnapshot(`"<!--v-if-->"`)
  })

  it('matches when the URL pathname starts with that base', () => {
    const wrapper = mount(MemoryRouter, {
      props: {
        initialEntries: ['/app/users/michael/dashboard'],
        basename: '/app',
      },
      slots: {
        default: () => h(Routes, { routes }),
      },
    })

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div>
  <h1>User: michael</h1>
  <h1>Dashboard</h1>
</div>"`,
    )
  })
})
