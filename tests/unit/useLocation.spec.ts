import { h } from 'vue'
import { useLocation, MemoryRouter, Link } from '~'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
describe('useLocation', () => {
  it('is reactive', async () => {
    const wrapper = mount({
      render: () =>
        h(MemoryRouter, () => [
          h(Link, { to: '/path' }),
          h({
            setup() {
              const location = useLocation()

              return () => h('div', location.value.pathname)
            },
          }),
        ]),
    })

    expect(wrapper.find('div').text()).toStrictEqual('/')

    await wrapper.find('a').trigger('click')

    expect(wrapper.find('div').text()).toStrictEqual('/path')
  })
})
