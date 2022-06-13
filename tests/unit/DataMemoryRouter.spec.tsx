import { it, describe, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueRouteObject } from '../../src/remix/types'
import { defineComponent } from 'vue'
import DataMemoryRouter from '../../src/remix/DataMemoryRouter.vue'
import Outlet from '../../src/remix/Outlet.vue'

describe('<DataMemoryRouter>', () => {
  it('renders the first route that matches the URL', () => {
    const routes: VueRouteObject[] = [
      {
        path: '/',
        element: defineComponent(() => () => <h1>Home</h1>),
      },
    ]

    const wrapper = mount(DataMemoryRouter, {
      props: {
        routes,
        initialEntries: ['/'],
        hydrationData: {},
      },
      slots: {
        fallback: () => defineComponent(() => () => <span />),
        default: () => defineComponent(() => () => <Outlet />),
      },
    })


    expect(wrapper.html()).toMatchInlineSnapshot('"<h1>Home</h1>"')
  })
})
