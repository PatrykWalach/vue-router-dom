<script lang="ts" setup>
import {
  createMemoryRouter,
  HydrationState,
  InitialEntry,
} from '@remix-run/router'
import { markRaw } from 'vue'
import { VueRouteObject } from '../remix/types'
import DataRouter, { enumerate } from './DataRouter.vue'
import DataRouterProvider from './DataRouterProvider.vue'
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
