import {
  createMemoryHistory,
  Route,
  MemoryHistory,
  ROUTER_HISTORY,
} from '../../src'

import { mount } from '@vue/test-utils'

describe('Route', () => {
  let history: MemoryHistory

  beforeEach(() => {
    history = createMemoryHistory()
  })

  it('does not render for no match', () => {
    history.push('/settings')

    const slotText = 'Home'

    const wrapper = mount(Route, {
      props: { path: '/home' },
      slots: {
        default: slotText,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.html()).not.toContain(slotText)
  })

  it('renders for a match', () => {
    history.push('/home')

    const slotText = 'Home'

    const wrapper = mount(Route, {
      props: { path: '/home' },
      slots: {
        default: slotText,
      },
      global: {
        provide: {
          [ROUTER_HISTORY as symbol]: history,
        },
      },
    })

    expect(wrapper.html()).toContain(slotText)
  })
})
