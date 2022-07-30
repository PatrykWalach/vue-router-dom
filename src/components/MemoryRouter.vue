<script lang="ts" setup>
import {
  createMemoryRouter,
  HydrationState,
  RouteObject,
  InitialEntry,
  createMemoryHistory,
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
