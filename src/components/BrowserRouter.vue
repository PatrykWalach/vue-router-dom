<script lang="ts" setup>
import {
  createMemoryRouter,
  HydrationState,
  RouteObject,
  InitialEntry,
  createMemoryHistory,
  createBrowserHistory,
} from '@remix-run/router'
import {
  provide,
  shallowRef,
  toRefs,
  defineComponent,
  computed,
  markRaw,
  watchEffect,
} from 'vue'
import { DataRouterKey, DataRouterStateKey } from '../remix/keys'
import { VueRouteObject, RemixRouter } from '../remix/types'
import DataRouterProvider from './DataRouterProvider.vue'
import Router from './Router.vue'
import { enumerate } from './DataRouter.vue'
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
