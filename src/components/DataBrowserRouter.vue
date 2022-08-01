<script lang="ts" setup>
import {
  createMemoryRouter,
  HydrationState,
  RouteObject,
  Router,
  InitialEntry,
  createBrowserRouter,
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
