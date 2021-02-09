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
      '/courses/routing': `<div><h1>Courses</h1><div><h2>Course routing</h2></div></div>`,
      '/courses/routing/grades': `<div><h1>Courses</h1><div><h2>Course routing</h2><p>Course Grades</p></div></div>`,
      '/courses/new': `<div><h1>Courses</h1><p>New Course</p></div>`,
      '/courses/not/found': `<div><h1>Courses</h1><p>Course not found</p></div>`,
      '/courses/vue-fundamentals': `<div><h1>Welcome to Vue Training</h1><p>Vue Fundamentals</p></div>`,
      '/courses/advanced-vue': `<div><h1>Welcome to Vue Training</h1><p>Advanced Vue</p></div>`,
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

  describe('using <Routes> with <Route> slots no #element', () => {
    const routes = defineComponent({
      components,
      template: `
      <Routes>
        <Route path="courses">
          <template>
            <Courses />
          </template>
          <Route path=":id">
            <template>
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
          <Route path="*">
            <CoursesNotFound />
          </Route>
        </Route>
        <Route path="courses">
          <template>
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
        <Route path="*">
          <NotFound />
        </Route>
      </Routes>`,
    })

    describeRouteMatching(routes)
  })
})
