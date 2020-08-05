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

    testPaths.forEach((path) => {
      it(`renders the right elements at ${path}`, () => {
        expect(renderRoutes(component, path)).toMatchSnapshot()
      })
    })
  }
  const Courses = defineComponent({
    setup() {
      return () => h('div', [h('h1', `Courses`), h(Outlet)])
    },
  })

  const Course = defineComponent({
    setup() {
      const params = useParams()

      return () => h('div', [h('h2', `Course ${params.value.id}`), h(Outlet)])
    },
  })

  const CourseGrades = () => h('p', 'Course Grades')
  const NewCourse = () => h('p', 'New Course')
  const CoursesIndex = () => h('p', 'All Courses')
  const CoursesNotFound = () => h('p', 'Course Not Found')

  const Landing = () => h('p', [h('h1', 'Welcome to Vue Training'), h(Outlet)])

  const VueFundamentals = () => h('p', 'Vue Fundamentals')

  const AdvancedVue = () => h('p', 'Advanced Vue')
  const Home = () => h('p', 'Home')
  const NotFound = () => h('p', 'Not Found')

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
        element: h(Courses),
        children: [
          {
            path: ':id',
            element: h(Course),
            children: [{ path: 'grades', element: h(CourseGrades) }],
          },
          { path: 'new', element: h(NewCourse) },
          { path: '/', element: h(CoursesIndex) },
          { path: '*', element: h(CoursesNotFound) },
        ],
      },
      {
        path: 'courses',
        element: h(Landing),
        children: [
          { path: 'vue-fundamentals', element: h(VueFundamentals) },
          { path: 'advanced-vue', element: h(AdvancedVue) },
          { path: '*', element: h(NeverRender) },
        ],
      },
      { path: '/', element: h(Home) },
      { path: '*', element: h(NotFound) },
    ]
    const RoutesRenderer = defineComponent({
      props: ['routes'],
      setup(props) {
        const element = useRoutes(() => props.routes)
        return () => element.value
      },
    })

    describeRouteMatching({ render: () => h(RoutesRenderer, { routes }) })
  })

  describe('using <Routes> with <Route> elements', () => {
    const routes = defineComponent({
      components: { Routes, Route },
      setup: () => ({
        h,
        Courses: markRaw(Courses),
        Course: markRaw(Course),
        CourseGrades: markRaw(CourseGrades),
        NewCourse: markRaw(NewCourse),
        CoursesIndex: markRaw(CoursesIndex),
        CoursesNotFound: markRaw(CoursesNotFound),
        Landing: markRaw(Landing),
        VueFundamentals: markRaw(VueFundamentals),
        NeverRender: markRaw(NeverRender),
        Home: markRaw(Home),
        NotFound: markRaw(NotFound),
        AdvancedVue: markRaw(AdvancedVue),
      }),
      template: `
      <Routes>
        <Route path="courses" :element="h(Courses)">
          <Route path=":id" :element="h(Course)">
            <Route path="grades" :element="h(CourseGrades)" />
          </Route>
          <Route path="new" :element="h(NewCourse)" />
          <Route path="/" :element="h(CoursesIndex)" />
          <Route path="*" :element="h(CoursesNotFound)" />
        </Route>
        <Route path="courses" :element="h(Landing)">
          <Route path="vue-fundamentals" :element="h(VueFundamentals)" />
          <Route path="advanced-vue" :element="h(AdvancedVue)" />
          <Route path="*" :element="h(NeverRender)" />
        </Route>
        <Route path="/" :element="h(Home)" />
        <Route path="*" :element="h(NotFound)" />
      </Routes>`,
    })

    describeRouteMatching(routes)
  })

  describe('using <Routes> and the *secret menu*', () => {
    const routes = defineComponent({
      components: {
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
      },
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
