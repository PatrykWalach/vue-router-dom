import { defineComponent, ref, h, computed } from 'vue'
import { useSearchParams, MemoryRouter, Routes, Route } from '../../src'
import { mount } from '@vue/test-utils'

describe('useSearchParams', () => {
  const SearchPage = defineComponent({
    setup() {
      const [searchParams, setSearchParams] = useSearchParams({ q: '' })

      const query = computed(() => searchParams.value.get('q'))

      function handleClick(event: MouseEvent) {
        event.preventDefault()
        setSearchParams({ q: 'Ryan Florence' })
      }

      return () =>
        h('div', [
          h('p', `The current query is "${query.value}"`),
          h('button', { onClick: handleClick }),
        ])
    },
  })

  it('reads and writes the search string', async () => {
    const wrapper = mount({
      render: () =>
        h(MemoryRouter, { initialEntries: [`/search?q=Michael+Jackson`] }, () =>
          h(Routes, () => h(Route, { path: 'search', element: h(SearchPage) })),
        ),
    })

    expect(wrapper.html()).toMatch(/The current query is "Michael Jackson"/)

    await wrapper.find('button').trigger('click')

    // await new Promise(nextTick)

    expect(wrapper.html()).toMatch(/The current query is "Ryan Florence"/)
  })
})
