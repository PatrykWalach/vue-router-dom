import { Routes, Outlet, MemoryRouter, VueRouteObject } from '../../src'

import { h, defineComponent, markRaw, Slot } from 'vue'
import { useRoutes, useParams } from '../../src'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { Component } from 'vue'
import type { RouteObject } from '../../src'

describe('route matching', () => {
  const renderRoutes = (slot: Slot, entry: string) => {
    const wrapper = mount(MemoryRouter, {
      props: {
        initialEntries: [entry],
      },
      slots: {
        default: slot,
      },
    })

    return wrapper.html()
  }

  const Courses = () => h('div', [h('h1', `Courses`), h(Outlet)])

  const Course = defineComponent({
    setup() {
      const params = useParams()

      return () => h('div', [h('h2', `Course ${params.value.id}`), h(Outlet)])
    },
  })

  function CourseGrades() {
    return h('p', 'Course Grades')
  }
  function NewCourse() {
    return h('p', 'New Course')
  }
  function CoursesIndex() {
    return h('p', 'All Courses')
  }
  function CoursesNotFound() {
    return h('p', 'Course Not Found')
  }
  function Landing() {
    return h('p', [h('h1', 'Welcome to Vue Training'), h(Outlet)])
  }
  function VueFundamentals() {
    return h('p', 'Vue Fundamentals')
  }
  function AdvancedVue() {
    return h('p', 'Advanced Vue')
  }
  function Home() {
    return h('p', 'Home')
  }

  function NotFound() {
    return h('p', 'Not Found')
  }

  const NeverRender = defineComponent({
    setup() {
      throw new Error('NeverRender should ... uh ... never render')
    },
    render: () => null,
  })

  describe('using a route config object', () => {
    const routes: RouteObject[] = [
      {
        path: 'courses',
        element: Courses,
        children: [
          {
            path: ':id',
            element: Course,
            children: [{ path: 'grades', element: CourseGrades }],
          },
          { path: 'new', element: NewCourse },
          { index: true, element: CoursesIndex },
          { path: '*', element: CoursesNotFound },
        ],
      },
      {
        path: 'courses',
        element: Landing,
        children: [
          { path: 'vue-fundamentals', element: VueFundamentals },
          { path: 'advanced-vue', element: AdvancedVue },
          { path: '*', element: NeverRender },
        ],
      },
      { index: true, element: Home },
      { path: '*', element: NotFound },
    ]

    const testPaths = [
      '/courses',
      '/courses/routing',
      '/courses/routing/grades',
      '/courses/new',
      '/courses/not/found',
      '/courses/vue-fundamentals',
      '/courses/advanced-vue',
      '/',
      '/not-found',
    ]

    for (const path of testPaths) {
      it(`renders the right elements at ${path}`, () => {
        expect(
          renderRoutes(() => [h(Routes, { routes })], path),
        ).toMatchSnapshot()
      })
    }
  })
})
