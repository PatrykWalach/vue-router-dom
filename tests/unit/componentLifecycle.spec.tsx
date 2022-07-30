import { Routes, Route, MemoryRouter, Link } from '../../src'
import { describe, it, expect } from 'vitest'
import { onMounted, h, defineComponent, KeepAlive } from 'vue'
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

    const wrapper = mount(() => (
      <MemoryRouter initialEntries={['/home']}>
        <Link to="/another-home"></Link>
        <Routes
          routes={[
            { path: 'home', element: Home },
            { path: 'another-home', element: Home },
          ]}
        >
          {({ component }) => (
            <KeepAlive>
              <component></component>
            </KeepAlive>
          )}
        </Routes>
      </MemoryRouter>
    ))

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<a href=\\"/another-home\\"></a>
<h1>Home</h1>"`,
    )
    expect(mountCount).toBe(1)

    await wrapper.find('a').trigger('click')

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<a href=\\"/another-home\\"></a>
<h1>Home</h1>"`,
    )
    expect(mountCount).toBe(1)
  })
})
