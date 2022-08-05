<script lang="ts" setup>
import { createMemoryHistory, InitialEntry } from '@remix-run/router'
import { shallowRef, watchEffect } from 'vue'
import { VueRouteObject } from '../remix/types'
import Router from './Router.vue'
interface Props {
  routes?: VueRouteObject[]
  initialEntries?: InitialEntry[]
  initialIndex?: number
  basename?: string
}
const props = defineProps<Props>()

const history = createMemoryHistory({
  initialEntries: props.initialEntries,
  initialIndex: props.initialIndex,
  v5Compat: true,
})

const state = shallowRef({
  action: history.action,
  location: history.location,
})

watchEffect(
  (onCleanup) => {
    onCleanup(history.listen((nextState) => (state.value = nextState)))
  },
  {
    flush: 'post',
  },
)
</script>

<template>
  <Router
    :basename="basename"
    :location="state.location"
    :navigationType="state.action"
    :navigator="history"
  >
    <slot></slot>
  </Router>
</template>
