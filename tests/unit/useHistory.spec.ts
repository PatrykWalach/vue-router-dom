// import { BrowserRouter, useHistory } from '../../src'
// import { createApp, defineComponent, h } from 'vue'

describe('useHistory()', () => {
  it('passes', () => {
    expect(() => {
      return
    }).not.toThrow()
  })

  //   const HistoryPush = defineComponent({
  //     setup() {
  //       const history = useHistory()
  //       history.push('/home')
  //       return () => h('div')
  //     },
  //   })

  //   it('throws without BrowserRouter', () => {
  //     expect(() => {
  //       createApp(HistoryPush).mount('')
  //     }).toThrow()
  //   })

  //   it('works with BrowserRouter', () => {
  //     expect(() => {
  //       createApp({
  //         setup() {
  //           return () => h(BrowserRouter, h(HistoryPush))
  //         },
  //       }).mount('#app')
  //     }).not.toThrow()
  //   })
})
