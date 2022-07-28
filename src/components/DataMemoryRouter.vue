<script lang="ts" setup>
import {
  createMemoryRouter,
  HydrationState,
  RouteObject,
  Router,
  InitialEntry,
} from '@remix-run/router'
import {
  provide,
  shallowRef,
  toRefs,
  defineComponent,
  computed,
  markRaw,
} from 'vue'
import { DataRouterKey, DataRouterStateKey } from '../remix/keys'
import { VueRouteObject, RemixRouter } from '../remix/types'
import DataRouterProvider from './DataRouterProvider.vue'
import DataRouter from './DataRouter.vue'
import { enumerate } from './DataRouter.vue'
interface DataBrowserRouterProps {
  routes?: VueRouteObject[]
  initialEntries?: InitialEntry[]
  initialIndex?: number
  hydrationData?: HydrationState
  basename?: string
}
const props = defineProps<DataBrowserRouterProps>()

const router = markRaw(
  createMemoryRouter({
    basename: props.basename,
    hydrationData: props.hydrationData,
    initialEntries: props.initialEntries,
    initialIndex: props.initialIndex,
    routes: enumerate(props.routes) ?? [],
  }).initialize(),
)

/** slots: ['fallback'] */
</script>

<template>
  <DataRouterProvider :router="router" :basename="basename">
    <template #fallback>
      <slot name="fallback" />
    </template>

    <DataRouter>
      <slot></slot>
    </DataRouter>
  </DataRouterProvider>
</template>
