import { Routes, Route, MemoryRouter } from '../../src'

import { defineComponent, h } from 'vue'
import { useOutlet } from '../../src'
import { mount } from '@vue/test-utils'

describe('useOutlet', () => {
  describe('when there is no child route', () => {
    it('returns null', () => {
      const Home = defineComponent({
        setup() {
          const outlet = useOutlet()
          return () => h(outlet.value)
        },
      })

      const wrapper = mount({
        render: () =>
          h(MemoryRouter, { initialEntries: ['/home'] }, () =>
            h(Routes, () => h(Route, { path: '/home', element: h(Home) })),
          ),
      })

      expect(wrapper.html()).toMatchInlineSnapshot(`"<!---->"`)
    })
  })

  describe('when there is a child route', () => {
    it('returns an element', () => {
      const Users = defineComponent({
        setup() {
          const outlet = useOutlet()
          return () => h(outlet.value)
        },
      })

      const Profile = () => h('p', 'Profile')

      const wrapper = mount({
        render: () =>
          h(MemoryRouter, { initialEntries: ['/users/profile'] }, () =>
            h(Routes, () =>
              h(Route, { path: 'users', element: h(Users) }, () => [
                h(Route, { path: 'profile', element: h(Profile) }),
              ]),
            ),
          ),
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
