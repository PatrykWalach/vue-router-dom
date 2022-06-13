<script lang="ts" setup>
/** slots: ['fallback'] */
import {
  createBrowserRouter,
  HydrationState,
  RouteObject, Router
} from '@remix-run/router'
import { provide, shallowRef, toRefs } from 'vue'
import { DataRouterContext, DataRouterStateContext } from './keys'
import { VueRouteObject, Navigator } from './types'
import DataRouter from './DataRouter.vue'

interface DataBrowserRouterProps {
  hydrationData?: HydrationState
  routes: VueRouteObject[]
  window?: Window
}


const { routes, hydrationData, window } = toRefs(defineProps<DataBrowserRouterProps>())

</script>

<template>
  <DataRouter :createRouter="(routes) => createBrowserRouter({
    routes: routes,
    hydrationData,
    window,
  })" :routes="routes">
    <slot />
    <template #fallback>
      <slot name="fallback" />
    </template>
  </DataRouter>
</template>
