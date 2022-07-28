import type { VueRouteObject } from '../../src/remix/types'
import { defineComponent, withModifiers } from 'vue'
import DataMemoryRouter from '../../src/remix/DataMemoryRouter.vue'
import Outlet from '../../src/remix/Outlet.vue'
import {
  useLoaderData,
  useActionData,
  useNavigation,
  useDataRouter,
} from '../../src/remix/keys'
import { markRaw } from 'vue'

describe('<DataMemoryRouter>', () => {
  it('renders the first route that matches the URL', () => {
    const routes: VueRouteObject[] = [
      {
        path: '/',
        element: function Home() {
          return <h1>Home</h1>
        },
      },
    ]

    cy.mount(DataMemoryRouter, {
      props: {
        routes: markRaw(routes),
        initialEntries: ['/'],
        hydrationData: {},
      },
      slots: {
        fallback: () => <span />,
      },
    })

    cy.get('h1').contains('Home')
  })

  it("renders the first route that matches the URL when wrapped in a 'basename' route", () => {
    const routes: VueRouteObject[] = [
      {
        path: '/my/base/path',
        children: [
          {
            element: Outlet,
            children: [
              {
                path: 'thing',
                element: function Heyooo() {
                  return <h1>Heyooo</h1>
                },
              },
            ],
          },
        ],
      },
    ]

    // In data routers there is no basename and you should instead use a root route
    cy.mount(DataMemoryRouter, {
      props: {
        initialEntries: ['/my/base/path/thing'],
        hydrationData: {},
        routes: markRaw(routes),
      },
      slots: {
        fallback: () => <span />,
      },
    })

    cy.get('h1').contains('Heyooo')
  })

  it('renders with hydration data', () => {
    const Comp = defineComponent(function Comp() {
      let data = useLoaderData()
      let actionData = useActionData()
      let navigation = useNavigation()
      return () => (
        <div>
          <p>{data.value}</p>
          <p>{actionData.value}</p>
          <p>{navigation.value.state}</p>
          <Outlet />
        </div>
      )
    })

    cy.mount(
      DataMemoryRouter,

      {
        props: {
          initialEntries: ['/child'],
          hydrationData: {
            loaderData: {
              '0': 'parent data',
              '0-0': 'child data',
            },
            actionData: {
              '0-0': 'child action',
            },
          },
          routes: markRaw([
            {
              path: '/',
              element: Comp,
              children: [{ path: 'child', element: Comp }],
            },
          ]),
        },
        slots: {
          fallback: () => <span />,
        },
      },
    )

    cy.get('div').within(() => {
      cy.get('p').contains('parent data')
      cy.get('p').contains('child action')
      cy.get('p').contains('idle')
      cy.get('div').within(() => {
        cy.get('p').contains('parent data')
        cy.get('p').contains('child action')
        cy.get('p').contains('idle')
      })
    })
  })

  function defer<T>(data: T) {
    return new Promise<T>((resolve) => setTimeout(resolve, 100, data))
  }

  ;(
    [
      [
        'renders fallback slot while first data fetch happens',
        { fallback: () => <p>Loading...</p> },
        '<p>Loading...</p>',
      ],
      ['renders a null fallbackElement if none is provided', {}, ''],
    ] as const
  ).forEach(([name, slots, expected]) => {
    it(name, () => {
      const Foo = defineComponent(function Foo() {
        let data = useLoaderData()

        return () => <h1>Foo:{data.value.message}</h1>
      })

      function Bar() {
        return <h1>Bar Heading</h1>
      }

      const routes: VueRouteObject[] = [
        {
          path: '/',
          element: Outlet,
          children: [
            {
              path: 'foo',
              loader: () => defer({ message: 'From Foo Loader' }),
              element: Foo,
            },
            {
              path: 'bar',
              element: Bar,
            },
          ],
        },
      ]

      cy.mount(DataMemoryRouter, {
        props: {
          initialEntries: ['/foo'],
          routes: markRaw(routes),
        },
        slots,
      })

      // expect(wrapper.html()).toBe(expected)

      cy.get('h1').contains('Foo:From Foo Loader')
    })
  })

  it('does not render fallbackElement if no data fetch is required', () => {
    const Foo = defineComponent(function Foo() {
      let data = useLoaderData()

      return () => <h1>Foo:{data.value.message}</h1>
    })

    function Bar() {
      return <h1>Bar Heading</h1>
    }

    const routes: VueRouteObject[] = [
      {
        path: '/',
        element: Outlet,
        children: [
          {
            path: 'foo',
            loader: () => defer({ message: 'From Foo Loader' }),
            element: Foo,
          },
          {
            path: 'bar',
            element: Bar,
          },
        ],
      },
    ]

    cy.mount(DataMemoryRouter, {
      props: {
        initialEntries: ['/bar'],
        routes: markRaw(routes),
      },
      slots: {
        fallback: () => <p>Loading...</p>,
      },
    })

    cy.get('h1').contains('Bar Heading')
  })

  const MemoryNavigate = defineComponent({
    name: 'MemoryNavigate',
    props: ['to'],
    setup(props) {
      const { router } = useDataRouter()

      return () => (
        <a
          href={props.to}
          onClick={withModifiers(() => router.navigate(props.to), ['prevent'])}
        >
          Link to {props.to}
        </a>
      )
    },
  })

  it('handles link navigations', () => {
    const Layout = defineComponent(function Layout() {
      return () => (
        <div>
          <MemoryNavigate to="/foo"></MemoryNavigate>
          <MemoryNavigate to="/bar"></MemoryNavigate>
          <Outlet />
        </div>
      )
    })

    function Foo() {
      return <h1>Foo Heading</h1>
    }

    function Bar() {
      return <h1>Bar Heading</h1>
    }

    const routes = [
      {
        path: '/',
        element: Layout,
        children: [
          { path: 'foo', element: Foo },
          { path: 'bar', element: Bar },
        ],
      },
    ]

    cy.mount(DataMemoryRouter, {
      props: {
        initialEntries: ['/foo'],
        routes: markRaw(routes),
        hydrationData: {},
      },
      slots: {
        fallback: () => <span></span>,
      },
    })

    cy.get('h1').contains('Foo Heading')
    cy.get('a').contains('Link to /bar').click()
    cy.get('h1').contains('Bar Heading')
    cy.get('a').contains('Link to /foo').click()
    cy.get('h1').contains('Foo Heading')
  })

  it('executes route loaders on navigation', () => {
    const Bar = defineComponent(function Bar() {
      let data = useLoaderData()
      return () => <h1>{data.value.message}</h1>
    })

    const Layout = defineComponent(function Layout() {
      let navigation = useNavigation()

      return () => (
        <div>
          <MemoryNavigate to="/bar"></MemoryNavigate>
          <p>{navigation.value.state}</p>
          <Outlet />
        </div>
      )
    })

    function Foo() {
      return <h1>Foo</h1>
    }

    const routes = [
      {
        path: '/',
        element: Layout,
        children: [
          {
            path: 'foo',
            element: Foo,
          },
          {
            path: 'bar',
            element: Bar,
            loader: () => defer({ message: 'Bar Loader' }),
          },
        ],
      },
    ]
    cy.mount(DataMemoryRouter, {
      props: {
        initialEntries: ['/foo'],
        routes: markRaw(routes),
        hydrationData: {},
      },
      slots: {
        fallback: () => <span></span>,
      },
    })

    cy.get('div').within(() => {
      cy.get('p').contains('idle')
      cy.get('h1').contains('Foo')
    })

    cy.get('a').contains('Link to /bar').click()

    cy.get('div').within(() => {
      cy.get('a').contains('Link to /bar')
      cy.get('p').contains('loading')
      cy.get('h1').contains('Foo')
    })

    cy.contains('idle')

    cy.get('div').within(() => {
      cy.get('a').contains('Link to /bar')
      cy.get('p').contains('idle')
      cy.get('h1').contains('Bar Loader')
    })
  })
})
