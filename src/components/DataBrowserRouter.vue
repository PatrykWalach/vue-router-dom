<script lang="ts" setup>
import { createBrowserRouter, HydrationState } from '@remix-run/router'
import { markRaw } from 'vue'
import { VueRouteObject } from '../remix/types'
import DataRouter, { enumerate } from './DataRouter.vue'
import DataRouterProvider from './DataRouterProvider.vue'
interface DataBrowserRouterProps {
  basename?: string
  hydrationData?: HydrationState
  routes?: VueRouteObject[]
  window?: Window
}
const props = defineProps<DataBrowserRouterProps>()

const router = markRaw(
  createBrowserRouter({
    basename: props.basename,
    hydrationData:
      props.hydrationData || (window as any)?.__staticRouterHydrationData,
    window: props.window,
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
