import { Routes, Route, MemoryRouter, Link } from '../../src'

import { onMounted, h, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

describe('when the same component is mounted by two different routes', () => {
  it('mounts only once', async () => {
    let mountCount = 0

    const Home = defineComponent({
      setup() {
        onMounted(() => {
          mountCount++
        })
        return () => h('h1', 'Home')
      },
    })

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: ['/home'] }, () => [
          h(Link, { to: '/another-home' }),
          h(Routes, () => [
            h(Route, { path: 'home', element: h(Home) }),
            h(Route, { path: 'another-home', element: h(Home) }),
          ]),
        ]),
    })

    expect(wrapper.html()).toMatchInlineSnapshot(`
      <a href="/another-home"></a>
      <h1>Home</h1>
    `)
    expect(mountCount).toBe(1)

    await wrapper.find('a').trigger('click')

    expect(wrapper.html()).toMatchInlineSnapshot(`
      <a href="/another-home"></a>
      <h1>Home</h1>
    `)
    expect(mountCount).toBe(1)
  })
})
