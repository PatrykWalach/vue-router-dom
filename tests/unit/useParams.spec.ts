import { mount } from '@vue/test-utils'
import { h, defineComponent, nextTick, isRef } from 'vue'
import { useParams, Routes, Route, MemoryRouter, Link } from '../../src'

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
          h(Routes, () => h(Route, { path: 'user/:userId', element: h(User) })),
        ]),
    })

    expect(fn).toBeCalledWith(true)

    expect(wrapper.find('div').text()).toStrictEqual('1')

    await wrapper.find('a').trigger('click')

    await new Promise(nextTick)

    expect(wrapper.find('div').text()).toStrictEqual('2')
  })
})
