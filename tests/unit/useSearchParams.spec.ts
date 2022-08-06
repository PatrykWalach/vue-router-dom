import { defineComponent, h, computed } from 'vue'
import { useSearchParams, MemoryRouter, Routes, Route } from '~'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('useSearchParams', () => {
  const SearchPage = defineComponent({
    setup() {
      const searchParams = useSearchParams()

      const query = computed(() => searchParams.get('q') ?? '')

      function handleClick(event: MouseEvent) {
        event.preventDefault()
        searchParams.set('q', 'Ryan Florence')
      }

      return () =>
        h('div', [
          h('p', `The current query is "${query.value}"`),
          h('button', { onClick: handleClick }),
        ])
    },
  })

  it('reads and writes the search string', async () => {
    const wrapper = mount(() =>
      h(MemoryRouter, { initialEntries: [`/search?q=Michael+Jackson`] }, () =>
        h(Routes, {
          routes: [{ path: 'search', element: SearchPage }],
        }),
      ),
    )

    expect(wrapper.html()).toMatch(/The current query is "Michael Jackson"/)

    await wrapper.find('button').trigger('click')

    // await new Promise(nextTick)

    expect(wrapper.html()).toMatch(/The current query is "Ryan Florence"/)
  })
})
