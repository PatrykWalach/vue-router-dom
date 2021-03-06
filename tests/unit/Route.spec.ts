import { Routes, Route, MemoryRouter } from '../../src'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

describe('A <Route>', () => {
  it('renders its `element` slot', () => {
    const Home = () => h('h1', 'Home')

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: ['/home'] }, () =>
          h(Routes, () =>
            h(Route, { path: '/home' }, { element: () => [h(Home)] }),
          ),
        ),
    })

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Home</h1>"`)
  })

  it('renders its `element` prop', () => {
    const Home = () => h('h1', 'Home')

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: ['/home'] }, () =>
          h(Routes, () => h(Route, { path: '/home', element: h(Home) })),
        ),
    })

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Home</h1>"`)
  })

  it('renders its child routes when no `element` prop is given', () => {
    const Home = () => h('h1', 'Home')

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: ['/app/home'] }, () =>
          h(Routes, () =>
            h(Route, { path: 'app' }, () => [
              h(Route, { path: 'home', element: h(Home) }),
            ]),
          ),
        ),
    })

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Home</h1>"`)
  })
})
