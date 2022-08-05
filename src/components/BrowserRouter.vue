<script lang="ts" setup>
import { createBrowserHistory } from '@remix-run/router'
import { shallowRef, watchEffect } from 'vue'
import Router from './Router.vue'
export interface BrowserRouterProps {
  basename?: string
  window?: Window
}

const props = defineProps<BrowserRouterProps>()

const history = createBrowserHistory({
  window: props.window,
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
