import {
  createMemoryHistory,
  MemoryHistory,
  State,
  ROUTER_HISTORY,
  Link,
  Location,
} from '../../src'
import { mount } from '@vue/test-utils'
// import { mount } from './utils'

describe('Link', () => {
  let history: MemoryHistory<State>

  beforeEach(() => {
    history = createMemoryHistory()
  })

  it(`renderes 'a' tag`, () => {
    const wrapper = mount(Link, {
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.find('a').exists()).toBe(true)
  })

  it(`renderes 'any' tag`, () => {
    const tag = 'div'

    const wrapper = mount(Link, {
      props: { tag },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.find(tag).exists()).toBe(true)
  })

  it(`renderes slot`, () => {
    const contents = 'click me'

    const wrapper = mount(Link, {
      slots: {
        default: contents,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.text()).toContain(contents)
  })

  it(`renders correct href for 'to' string`, () => {
    const to = '/about'

    const wrapper = mount(Link, {
      props: {
        to,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.attributes('href')).toStrictEqual('/about')
  })

  it(`renders correct href for 'to' object`, () => {
    const to = { pathname: '/search', search: '?user=Mark', hash: '#' }

    const wrapper = mount(Link, {
      props: {
        to,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.attributes('href')).toStrictEqual('/search?user=Mark#')
  })

  it(`renders correct href for 'to' function returning object`, () => {
    history.push('/search')

    const to = (location: Location) => ({
      pathname: location.pathname,
      search: '?user=Mark',
      hash: '#',
    })

    const wrapper = mount(Link, {
      props: {
        to,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.attributes('href')).toStrictEqual('/search?user=Mark#')
  })

  it(`renders correct href for 'to' function returning string`, () => {
    history.push('/search')

    const to = (location: Location) => `${location.pathname}?user=Mark#`

    const wrapper = mount(Link, {
      props: {
        to,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.attributes('href')).toStrictEqual('/search?user=Mark#')
  })

  it(`navigates correctly for 'to' string`, async () => {
    const to = '/about'

    const wrapper = mount(Link, {
      props: {
        to,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    await wrapper.trigger('click')

    expect(history.location.pathname).toStrictEqual(to)
  })

  it(`navigates correctly for 'to' object`, () => {
    const to = { pathname: '/search', search: '?user=Mark', hash: '#' }

    const wrapper = mount(Link, {
      props: {
        to,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.attributes('href')).toStrictEqual('/search?user=Mark#')
  })

  it(`navigates correctly for 'to' function returning object`, () => {
    history.push('/search')

    const to = (location: Location) => ({
      pathname: location.pathname,
      search: '?user=Mark',
      hash: '#',
    })

    const wrapper = mount(Link, {
      props: {
        to,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.attributes('href')).toStrictEqual('/search?user=Mark#')
  })

  it(`navigates correctly for 'to' function returning string`, () => {
    history.push('/search')

    const to = (location: Location) => `${location.pathname}?user=Mark#`

    const wrapper = mount(Link, {
      props: {
        to,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.attributes('href')).toStrictEqual('/search?user=Mark#')
  })
})
