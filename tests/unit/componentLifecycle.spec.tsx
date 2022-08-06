import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, onMounted } from 'vue'
import { Link, MemoryRouter, Routes } from '~'

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
        ></Routes>
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
