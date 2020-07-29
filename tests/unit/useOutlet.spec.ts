import { defineComponent, h } from 'vue'
import { useOutlet, Routes, Route } from '../../src'
import { mount } from '@vue/test-utils'
import { createMemoryRouter } from '../../src/api/install'

describe('useOutlet', () => {
  describe('when there is no child route', () => {
    it('returns null', () => {
      const Home = defineComponent({
        setup() {
          const outlet = useOutlet()
          return () => outlet.value
        },
      })

      const wrapper = mount(
        {
          render: () =>
            h(Routes, () => h(Route, { path: '/home', element: h(Home) })),
        },
        {
          global: {
            plugins: [createMemoryRouter({ initialEntries: ['/home'] })],
          },
        },
      )

      expect(wrapper.html()).toMatchInlineSnapshot(`"<!---->"`)
    })
  })

  describe('when there is a child route', () => {
    it('returns an element', () => {
      const Users = defineComponent({
        setup() {
          const outlet = useOutlet()
          return () => outlet.value
        },
      })

      const Profile = () => h('p', 'Profile')

      const wrapper = mount(
        {
          render: () =>
            h(Routes, () =>
              h(Route, { path: 'users', element: h(Users) }, () => [
                h(Route, { path: 'profile', element: h(Profile) }),
              ]),
            ),
        },
        {
          global: {
            plugins: [
              createMemoryRouter({ initialEntries: ['/users/profile'] }),
            ],
          },
        },
      )

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
