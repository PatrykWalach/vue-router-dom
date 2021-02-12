import { Routes, Route, Outlet, MemoryRouter } from '../../src'

import { h, defineComponent, markRaw } from 'vue'
import { useRoutes, useParams } from '../../src'
import { mount } from '@vue/test-utils'

import { Component } from 'vue'
import { RouteObject } from '../../src'

describe('route matching', () => {
  const renderRoutes = (component: Component, entry: string) => {
    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: [entry] }, () => [h(component)]),
    })

    return wrapper.html()
  }

  function describeRouteMatching(component: Component) {
    const testPaths: Record<string, string> = {
      '/courses': `<div><h1>Courses</h1><p>All Courses</p></div>`,
      '/courses/routing': `<div><h1>Courses</h1><div><h2>Course routing</h2><!----></div></div>`,
      '/courses/routing/grades': `<div><h1>Courses</h1><div><h2>Course routing</h2><p>Course Grades</p></div></div>`,
      '/courses/new': `<div><h1>Courses</h1><p>New Course</p></div>`,
      '/courses/not/found': `<div><h1>Courses</h1><p>Course Not Found</p></div>`,
      '/courses/vue-fundamentals': `<p><h1>Welcome to Vue Training</h1><p>Vue Fundamentals</p></p>`,
      '/courses/advanced-vue': `<p><h1>Welcome to Vue Training</h1><p>Advanced Vue</p></p>`,
      '/': `<p>Home</p>`,
      '/not-found': `<p>Not Found</p>`,
    }

    for (const path in testPaths) {
      it(`renders the right elements at ${path}`, () => {
        expect(renderRoutes(component, path)).toMatch(testPaths[path])
      })
    }
  }

  const Courses = defineComponent({
    inheritAttrs: false,
    setup() {
      return () => h('div', [h('h1', `Courses`), h(Outlet)])
    },
  })

  const Course = defineComponent({
    inheritAttrs: false,
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
          { path: '/', element: CoursesIndex },
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
      { path: '/', element: Home },
      { path: '*', element: NotFound },
    ]

    const RoutesRenderer = defineComponent({
      props: ['routes'],
      setup(props) {
        const component = useRoutes(() => props.routes)
        return () => h(component.value)
      },
    })

    describeRouteMatching({ render: () => h(RoutesRenderer, { routes }) })
  })

  describe('using <Routes> with <Route> elements', () => {
    const routes = defineComponent({
      components: { Routes, Route },
      setup: () => markRaw(components),
      template: `
      <Routes>
        <Route path="courses" :element="Courses">
          <Route path=":id" :element="Course">
            <Route path="grades" :element="CourseGrades" />
          </Route>
          <Route path="new" :element="NewCourse" />
          <Route path="/" :element="CoursesIndex" />
          <Route path="*" :element="CoursesNotFound" />
        </Route>
        <Route path="courses" :element="Landing">
          <Route path="vue-fundamentals" :element="VueFundamentals" />
          <Route path="advanced-vue" :element="AdvancedVue" />
          <Route path="*" :element="NeverRender" />
        </Route>
        <Route path="/" :element="Home" />
        <Route path="*" :element="NotFound" />
      </Routes>`,
    })

    describeRouteMatching(routes)
  })

  const components = {
    Routes,
    AdvancedVue,
    Route,
    Courses,
    Course,
    CourseGrades,
    NewCourse,
    CoursesIndex,
    CoursesNotFound,
    Landing,
    VueFundamentals,
    NeverRender,
    Home,
    NotFound,
  }

  describe('using <Routes> with <Route> slots', () => {
    const routes = defineComponent({
      components,
      template: `
      <Routes>
        <Route path="courses">
          <template #element>
            <Courses />
          </template>
          <Route path=":id">
            <template #element>
              <Course />
            </template>
            <Route path="grades">
              <CourseGrades />
            </Route>
          </Route>
          <Route path="new">
            <NewCourse />
          </Route>
          <Route path="/">
            <CoursesIndex />
          </Route>
          <Route path="*" #element>
            <CoursesNotFound />
          </Route>
        </Route>
        <Route path="courses">
          <template #element>
            <Landing />
          </template>
          <Route path="vue-fundamentals">
            <VueFundamentals />
          </Route>
          <Route path="advanced-vue">
            <AdvancedVue />
          </Route>
          <Route path="*">
            <NeverRender />
          </Route>
        </Route>
        <Route path="/">
          <Home />
        </Route>
        <Route path="*" #element>
          <NotFound />
        </Route>
      </Routes>`,
    })

    describeRouteMatching(routes)
  })

  describe('using <Routes> and the *secret menu*', () => {
    const routes = defineComponent({
      components,
      template: `
      <Routes>
        <Courses path="courses">
          <Course path=":id">
            <CourseGrades path="grades" />
          </Course>
          <NewCourse path="new" />
          <CoursesIndex path="/" />
          <CoursesNotFound path="*" />
        </Courses>
        <Landing path="courses">
          <VueFundamentals path="vue-fundamentals" />
          <AdvancedVue path="advanced-vue" />
          <NeverRender path="*" />
        </Landing>
        <Home path="/" />
        <NotFound path="*" />
      </Routes>`,
    })

    describeRouteMatching(routes)
  })
})
