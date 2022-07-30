import { mount } from '@vue/test-utils'
import { h, defineComponent, nextTick, isRef } from 'vue'
import { useParams, Routes, Route, MemoryRouter, Link } from '../../src'
import { describe, it, expect, vi as jest } from 'vitest'
describe('useParams.spec', () => {
  it('is reactive', async () => {
    const fn = jest.fn()

    const User = defineComponent({
      setup() {
        const params = useParams()

        fn(isRef(params))

        return () => h('div', params.value.userId)
      },
    })

    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: ['/user/1'] }, () => [
          h(Link, { to: '/user/2' }),
          h(Routes, {
            routes: [{ path: 'user/:userId', element: User }],
          }),
        ]),
    })

    expect(fn).toBeCalledWith(true)

    expect(wrapper.find('div').text()).toStrictEqual('1')

    await wrapper.find('a').trigger('click')

    await new Promise<void>(nextTick)

    expect(wrapper.find('div').text()).toStrictEqual('2')
  })
})
