import { Routes, Route, MemoryRouter, Outlet } from '../../src'

import { defineComponent, h } from 'vue'
import { useOutlet } from '../../src'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
describe('useOutlet', () => {
  describe('when there is no child route', () => {
    it('returns null', () => {
      const wrapper = mount({
        render: () =>
          h(MemoryRouter, { initialEntries: ['/home'] }, () =>
            h(Routes, {
              routes: [{ path: '/home', element: Outlet }],
            }),
          ),
      })

      expect(wrapper.html()).toMatchInlineSnapshot(`""`)
    })
  })

  describe('when there is a child route', () => {
    it('returns an element', () => {
      const Profile = () => h('p', 'Profile')

      const wrapper = mount({
        render: () =>
          h(MemoryRouter, { initialEntries: ['/users/profile'] }, () =>
            h(Routes, {
              routes: [
                {
                  path: 'users',
                  element: Outlet,
                  children: [{ path: 'profile', element: Profile }],
                },
              ],
            }),
          ),
      })

      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
