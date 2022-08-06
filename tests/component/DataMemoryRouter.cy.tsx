import { defer as deferred } from '@remix-run/router'
import { divide } from 'cypress/types/lodash'
import { mount } from 'cypress/vue'

import {
  defineComponent,
  markRaw,
  onErrorCaptured,
  ref,
  Suspense,
  watchEffect,
  withModifiers,
} from 'vue'
import type { RouteObject as VueRouteObject } from '~'
import { useRouteError } from '~'
import {
  DataMemoryRouter,
  Outlet,
  useActionData,
  useDataRouter,
  useLoaderData,
  useNavigation,
  Await,
  useAsyncValue,
  useAsyncError,
} from '~'

describe('<DataMemoryRouter>', () => {
  // let consoleWarn: SpyInstance
  // let consoleError: SpyInstance
  beforeEach(() => {
    // window.location.href = 'http://localhost:8080'
    //   consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    //   consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  // afterEach(() => {
  //   consoleWarn.mockRestore()
  //   consoleError.mockRestore()
  // })
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

describe('defer', () => {
  ;(
    [
      ['allows loaders to return deffered data (child component)'],
      [
        'allows loaders to return deferred data (render prop)',
        { useRenderProp: true },
      ],
    ] as const
  ).forEach(([test, options]) =>
    it(test, () => {
      setupDeferred({
        data: deferred({
          critical: 'CRITICAL',
          lazy: defer('LAZY', 200),
        }),
        ...options,
      })

      cy.contains('Link to /bar').click()

      cy.get('div').within(() => {
        cy.get('a')
        cy.get('p').contains('loading')
        cy.get('h1').contains('Foo')
      })

      cy.contains('idle')

      cy.get('div').within(() => {
        cy.get('a')
        cy.get('p').contains('idle')
        cy.get('p').contains('CRITICAL')
        cy.get('p').contains('Loading...')
      })

      cy.contains('LAZY')

      cy.get('div').within(() => {
        cy.get('a')
        cy.get('p').contains('idle')
        cy.get('p').contains('CRITICAL')
        cy.get('p').contains('LAZY')
      })
    }),
  )

  it('sends data errors to the provided error', () => {
    setupDeferred({
      data: deferred({
        critical: 'CRITICAL',
        lazy: reject(new Error('Kaboom!'), 200),
      }),
      hasRouteErrorElement: true,
      hasAwaitErrorElement: true,
    })

    cy.contains('Link to /bar').click()
    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('loading')
      cy.get('h1').contains('Foo')
    })

    cy.contains('idle')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL')
      cy.get('p').contains('Loading...')
    })

    cy.contains('Await Error: Kaboom!')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL')
      cy.get('p').contains('Await Error: Kaboom!')
    })
  })

  it('sends unhandled data errors to the nearest route error boundary', () => {
    setupDeferred({
      data: deferred({
        critical: 'CRITICAL',
        lazy: reject(new Error('Kaboom!'), 200),
      }),
      hasRouteErrorElement: true,
    })

    cy.contains('Link to /bar').click()
    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('loading')
      cy.get('h1').contains('Foo')
    })

    cy.contains('idle')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL')
      cy.get('p').contains('Loading...')
    })

    cy.contains('Loading...').should('not.exist')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL').should('not.exist')
      cy.get('p').contains('Route Error: Kaboom!')
    })
  })

  it('sends render errors to the provided errorElement', () => {
    setupDeferred({
      data: deferred({
        critical: 'CRITICAL',
        lazy: defer('LAZY', 200),
      }),
      hasRouteErrorElement: true,
      hasAwaitErrorElement: true,
      triggerRenderError: true,
    })

    cy.contains('Link to /bar').click()
    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('loading')
      cy.get('h1').contains('Foo')
    })

    cy.contains('idle')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL')
      cy.get('p').contains('Loading...')
    })

    cy.contains('Loading...').should('not.exist')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL')
      cy.get('p').contains('Await Error: Unexpected end of JSON input')
    })
  })

  it('sends unhandled render errors to the nearest route error boundary', () => {
    setupDeferred({
      data: deferred({
        critical: 'CRITICAL',
        lazy: defer('LAZY', 200),
      }),
      hasRouteErrorElement: true,
      triggerRenderError: true,
    })

    cy.contains('Link to /bar').click()
    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('loading')
      cy.get('h1').contains('Foo')
    })

    cy.contains('idle')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL')
      cy.get('p').contains('Loading...')
    })

    cy.contains('Loading...').should('not.exist')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL').should('not.exist')
      cy.get('p').contains('Route Error: Unexpected end of JSON input')
    })
  })

  it('does not handle error render errors in the Deferred errorElement', () => {
    setupDeferred({
      data: deferred({
        critical: 'CRITICAL',
        lazy: defer('LAZY', 200),
      }),
      hasRouteErrorElement: true,
      hasAwaitErrorElement: true,
      triggerRenderError: true,
      triggerFallbackError: true,
    })

    cy.contains('Link to /bar').click()
    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('loading')
      cy.get('h1').contains('Foo')
    })

    cy.contains('idle')

    cy.get('div').within(() => {
      cy.get('a')
      cy.get('p').contains('idle')
      cy.get('p').contains('CRITICAL').should('not.exist')
      cy.get('p').contains('Route Error: Unexpected end of JSON input')
    })
  })

  it('can render raw resolved promises with <Await>', () => {
    cy.mount(() => (
      <div>
        <Suspense
          v-slots={{
            fallback: () => <p>Loading...</p>,
            default: () => (
              <Await
                resolve={defer('RESOLVED')}
                v-slots={{ default: ({ data }) => <p>{data}</p> }}
              ></Await>
            ),
          }}
        ></Suspense>
      </div>
    ))

    cy.get('p').contains('Loading...')
    cy.get('p').contains('Loading...').should('not.exist')
    cy.get('p').contains('RESOLVED')
  })

  it('can render raw rejected promises with <Await>', () => {
    const ErrorElement = defineComponent(function ErrorElement() {
      const error = useAsyncError()
      return () => <p>Error: {error.value}</p>
    })

    cy.mount(() => (
      <div>
        <Suspense
          v-slots={{
            fallback: () => <p>Loading...</p>,
            default: () => (
              <Await
                resolve={reject('REJECTED')}
                v-slots={{
                  error: () => <ErrorElement />,
                  default: ({ data }) => <p>{data}</p>,
                }}
              />
            ),
          }}
        ></Suspense>
      </div>
    ))

    cy.get('p').contains('Loading...')
    cy.get('p').contains('Loading...').should('not.exist')
    cy.get('p').contains('Error: REJECTED')
  })
})

function setupDeferred({
  hasAwaitErrorElement = false,
  useRenderProp = false,
  triggerFallbackError = false,
  triggerRenderError = false,
  data,
  hasRouteErrorElement = false,
}: {
  hasAwaitErrorElement?: boolean
  useRenderProp?: boolean
  triggerFallbackError?: boolean
  triggerRenderError?: boolean
  data: {}
  hasRouteErrorElement?: boolean
}) {
  const Layout = defineComponent(function Layout() {
    const navigation = useNavigation()
    return () => (
      <>
        <MemoryNavigate to="/bar"></MemoryNavigate>
        <p>{navigation.value.state}</p>
        <Outlet></Outlet>
      </>
    )
  })
  const Bar = defineComponent(function Bar() {
    const data = useLoaderData()

    return () => (
      <>
        <p>{data.value.critical}</p>
        <Suspense
          v-slots={{
            fallback: () => <LazyFallback />,
            default: () => (
              <Await
                resolve={data.value.lazy}
                v-slots={{
                  error: hasAwaitErrorElement ? () => <LazyError /> : undefined,
                  default: ({ data }) =>
                    useRenderProp ? <p>{data}</p> : <LazyData />,
                }}
              />
            ),
          }}
        />
      </>
    )
  })
  function Foo() {
    return <h1>Foo</h1>
  }

  function LazyFallback() {
    return triggerFallbackError ? <p>{JSON.parse('"')}</p> : <p>Loading...</p>
  }

  const LazyData = defineComponent(function LazyData() {
    let data = useAsyncValue()

    return () =>
      triggerRenderError ? <p>{JSON.parse('"')}</p> : <p>{data.value}</p>
  })

  const LazyError = defineComponent(function LazyError() {
    let data = useAsyncError()
    return () => <p>Await Error: {data.value.message}</p>
  })

  const RouteError = defineComponent(function RouteError() {
    let error = useRouteError()
    return () => <p>Route Error: {error.value.message}</p>
  })

  cy.mount(DataMemoryRouter, {
    props: {
      initialEntries: ['/foo'],
      hydrationData: {},
      routes: markRaw([
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
              loader: () => defer(data),
              element: Bar,
              errorElement: hasRouteErrorElement ? RouteError : undefined,
            },
          ],
        },
      ]),
    },
  })
}

// it("executes route actions/loaders on submission navigations", async () => {
//   let barDefer = defer();
//   let barActionDefer = defer();
//   let formData = new FormData();
//   formData.append("test", "value");

//   let { container } = render(
//     <DataMemoryRouter
//       errorElement={<span />}
//       initialEntries={["/foo"]}
//       hydrationData={{}}
//     >
//       <Route path="/" element={<Layout />}>
//         <Route path="foo" element={<Foo />} />
//         <Route
//           path="bar"
//           action={() => barActionDefer.promise}
//           loader={() => barDefer.promise}
//           element={<Bar />}
//         />
//       </Route>
//     </DataMemoryRouter>
//   );

//   function Layout() {
//     let navigation = useNavigation();
//     return (
//       <div>
//         <MemoryNavigate to="/bar" formMethod="post" formData={formData}>
//           Post to Bar
//         </MemoryNavigate>
//         <p>{navigation.state}</p>
//         <Outlet />
//       </div>
//     );
//   }

//   function Foo() {
//     return <h1>Foo</h1>;
//   }
//   function Bar() {
//     let data = useLoaderData();
//     let actionData = useActionData();
//     return (
//       <h1>
//         {data}
//         {actionData}
//       </h1>
//     );
//   }

//   expect(getHtml(container)).toMatchInlineSnapshot(`
//     "<div>
//       <div>
//         <form>
//           Post to Bar
//         </form>
//         <p>
//           idle
//         </p>
//         <h1>
//           Foo
//         </h1>
//       </div>
//     </div>"
//   `);

//   fireEvent.click(screen.getByText("Post to Bar"));
//   expect(getHtml(container)).toMatchInlineSnapshot(`
//     "<div>
//       <div>
//         <form>
//           Post to Bar
//         </form>
//         <p>
//           submitting
//         </p>
//         <h1>
//           Foo
//         </h1>
//       </div>
//     </div>"
//   `);

//   barActionDefer.resolve("Bar Action");
//   await waitFor(() => screen.getByText("loading"));
//   expect(getHtml(container)).toMatchInlineSnapshot(`
//     "<div>
//       <div>
//         <form>
//           Post to Bar
//         </form>
//         <p>
//           loading
//         </p>
//         <h1>
//           Foo
//         </h1>
//       </div>
//     </div>"
//   `);

//   barDefer.resolve("Bar Loader");
//   await waitFor(() => screen.getByText("idle"));
//   expect(getHtml(container)).toMatchInlineSnapshot(`
//     "<div>
//       <div>
//         <form>
//           Post to Bar
//         </form>
//         <p>
//           idle
//         </p>
//         <h1>
//           Bar Loader
//           Bar Action
//         </h1>
//       </div>
//     </div>"
//   `);
// });

function defer<T>(data: T, timeMs = 100) {
  return new Promise<T>((resolve) => setTimeout(resolve, timeMs, data))
}

function reject<T>(data: T, timeMs = 100) {
  return new Promise<T>((_, reject) => setTimeout(reject, timeMs, data))
}

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
