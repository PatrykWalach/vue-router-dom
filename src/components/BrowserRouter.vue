<template>
  <Router v-bind="{ location, action, navigator }">
    <slot />
  </Router>
</template>

<script lang="ts">
import Router from './Router.vue'

import { defineComponent, computed, watch, toRefs, PropType } from 'vue'
import { useReducer } from '../utils/useReducer'
import { Update, createBrowserHistory } from 'history'

export default defineComponent({
  name: 'BrowserRouter',

  components: { Router },

  props: {
    window: {
      required: false,
      type: Object as PropType<Window>,
    },
  },

  setup(props) {
    const history = computed(() =>
      createBrowserHistory({
        window: props.window,
      }),
    )

    const [state, dispatch] = useReducer(
      (state, { action, location }: Update) => {
        state.action = action
        state.location = location
      },
      {
        action: history.value.action,
        location: history.value.location,
      },
    )

    watch(history, history => history.listen(dispatch), {
      flush: 'sync',
      immediate: true,
    })

    return {
      ...toRefs(state),
      navigator: history,
    }
  },
})
</script>
