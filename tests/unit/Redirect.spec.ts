import {
  Redirect,
  createMemoryHistory,
  MemoryHistory,
  State,
  Route,
  Switch,
  ROUTER_HISTORY,
  generatePath,
} from '../../src'
import { mount } from '@vue/test-utils'

const createPath = (path: string) => {
  const fun = (params?: Record<string, string>) =>
    params ? generatePath(path, params) : path
  // (...args: string[]) =>
  //   path.replace(/:[^\/]+/g, (match) => args.shift() || match)
  fun.toString = () => path
  return fun
}

describe('Redirect()', () => {
  const USERS = createPath(`/users/:id`)
  const USERS_PROFILE = createPath(`/users/profile/:id`)

  let history: MemoryHistory<State>

  beforeEach(() => {
    history = createMemoryHistory()
  })

  it('redirects without from', () => {
    const to = '/home'

    mount(Redirect, {
      props: { to, exact: true },
      global: { provide: { [ROUTER_HISTORY as symbol]: history } },
    })

    expect(history.location.pathname).toStrictEqual(to)
  })

  it('redirects with matched parameters', () => {
    const id = '12'

    history.push(USERS_PROFILE({ id }))

    mount(Redirect, {
      props: { from: USERS_PROFILE(), to: USERS() },
      global: { provide: { [ROUTER_HISTORY as symbol]: history } },
    })

    expect(history.location.pathname).toStrictEqual(USERS({ id }))
  })

  it('redirects with matched parameters', () => {
    const id = '12'

    history.push(USERS({ id }))

    mount(
      {
        components: { Route, Switch, Redirect },
        template: `
        <Switch>
          <Route path="${USERS_PROFILE}">
            <div>Profile</div>
          </Route>
          <Redirect from="${USERS}" to="${USERS_PROFILE}"/>
        </Switch>
      `,
      },
      {
        global: { provide: { [ROUTER_HISTORY as symbol]: history } },
      },
    )

    expect(history.location.pathname).toStrictEqual(USERS_PROFILE({ id }))
  })

  it('redirects with params and exact', () => {
    const id = '12'

    history.push(USERS({ id }))

    mount(Redirect, {
      props: { from: USERS(), to: USERS_PROFILE() },
      global: { provide: { [ROUTER_HISTORY as symbol]: history } },
    })

    expect(history.location.pathname).toStrictEqual(USERS_PROFILE({ id }))
  })
})
