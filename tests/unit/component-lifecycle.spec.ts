import { Routes, Route } from '../../src'

import { createMemoryHistory, install } from '../../src'
import { onMounted, h, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

describe('when the same component is mounted by two different routes', () => {
  it('mounts only once', () => {
    let mountCount = 0

    const Home = defineComponent({
      setup() {
        onMounted(() => {
          mountCount++
        })
        return () => h('h1', 'Home')
      },
    })

    const history = createMemoryHistory({ initialEntries: ['/home'] })

    const wrapper = mount(
      {
        render: () =>
          h(Routes, () => [
            h(Route, { path: 'home', element: h(Home) }),
            h(Route, { path: 'another-home', element: h(Home) }),
          ]),
      },
      {
        global: {
          plugins: [(app) => install(app, history)],
        },
      },
    )

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Home</h1>"`)
    expect(mountCount).toBe(1)

    history.push('/another-home')

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Home</h1>"`)
    expect(mountCount).toBe(1)
  })
})
