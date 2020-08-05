import { Routes, Route, Outlet, MemoryRouter } from '../../src'

import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import { useParams } from '../../src'

describe('A <Routes>', () => {
  it('renders the first route that matches the URL', () => {
    const Home = () => h('h1', 'Home')

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, () =>
          h(Routes, () => h(Route, { path: '/', element: h(Home) })),
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
          h(Routes, () => [
            h(Route, { path: '/home', element: h(Home) }),
            h(Route, { path: '/home', element: h(Dashboard) }),
          ]),
        ),
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders with non-element children', () => {
    const Home = () => h('h1', 'Home')

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, () =>
          h(Routes, () => [
            h(Route, { path: '/', element: h(Home) }),
            false,
            undefined,
          ]),
        ),
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders with Fragment children', () => {
    const Home = () => h('h1', 'Home')
    const Admin = () => h('h1', 'Admin')

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: ['/admin'] }, () =>
          h(Routes, () => [
            h(Route, { path: '/', element: h(Home) }),
            h('template', h(Route, { path: '/admin', element: h(Admin) })),
          ]),
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

  const userRoute = () =>
    h(Route, { path: 'users/:userId', element: h(User) }, () => [
      h(Route, { path: 'dashboard', element: h(Dashboard) }),
    ])

  it('does not match when the URL pathname does not start with that base', () => {
    const wrapper = mount({
      render: () =>
        h(
          MemoryRouter,
          { initialEntries: ['/app/users/michael/dashboard'] },
          () => h(Routes, { basename: '/base' }, userRoute),
        ),
    })

    expect(wrapper.html()).toMatchInlineSnapshot(`<!---->`)
  })

  it('matches when the URL pathname starts with that base', () => {
    const wrapper = mount({
      render: () =>
        h(
          MemoryRouter,
          { initialEntries: ['/app/users/michael/dashboard'] },
          () => h(Routes, { basename: '/app' }, userRoute),
        ),
    })

    expect(wrapper.html()).toMatchInlineSnapshot(`
      <div>
        <h1>User: michael</h1>
        <h1>Dashboard</h1>
      </div>
    `)
  })
})
