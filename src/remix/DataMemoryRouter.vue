<script lang="ts" setup>
/** slots: ['fallback'] */
import {
  createMemoryRouter,
  HydrationState,
  RouteObject, Router,
  InitialEntry
} from '@remix-run/router'
import { provide, shallowRef, toRefs, } from 'vue'
import { DataRouterContext, DataRouterStateContext } from './keys'
import { VueRouteObject, Navigator } from './types'
import DataRouter from './DataRouter.vue'

interface DataBrowserRouterProps {

  routes: VueRouteObject[]


  initialEntries?: InitialEntry[];
  initialIndex?: number;
  hydrationData?: HydrationState;


}


const props = defineProps<DataBrowserRouterProps>()

const { routes, initialEntries,
  initialIndex,
  hydrationData, } = toRefs(props)
</script>

<template>
  <DataRouter :createRouter="(routes) => createMemoryRouter({
    initialEntries,
    initialIndex,
    routes,
    hydrationData,
  })" :routes="routes">

    <template #fallback>
      <slot name="fallback" />
    </template>

    <slot />

  </DataRouter>
</template>
