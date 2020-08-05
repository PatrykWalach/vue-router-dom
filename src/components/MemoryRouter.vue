<script lang="ts">
import Router from './Router.vue'

import { toRefs, PropType } from 'vue'
import { defineComponent, computed, watch } from 'vue'
import { createMemoryHistory, Update, InitialEntry } from 'history'
import { useReducer } from '../utils/useReducer'

export default defineComponent({
  name: 'MemoryRouter',

  components: { Router },

  props: {
    initialEntries: {
      required: false,
      type: Array as PropType<InitialEntry[]>,
    },
    initialIndex: { required: false, type: Number },
  },

  setup(props) {
    const history = computed(() =>
      createMemoryHistory({
        initialEntries: props.initialEntries,
        initialIndex: props.initialIndex,
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

<template>
  <Router v-bind="{ location, action, navigator }">
    <slot />
  </Router>
</template>
