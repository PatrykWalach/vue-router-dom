<script lang="ts"></script>

<script lang="ts" setup>
import {
  createMemoryRouter,
  HydrationState,
  RouteObject,
  Router,
  InitialEntry,
} from '@remix-run/router'
import { provide, shallowRef, toRefs, defineComponent } from 'vue'
import { DataRouterKey, DataRouterStateKey } from './keys'
import { VueRouteObject, Navigator } from './types'
import DataRouter from './DataRouter.vue'
interface DataBrowserRouterProps {
  routes: VueRouteObject[]

  initialEntries?: InitialEntry[]
  initialIndex?: number
  hydrationData?: HydrationState
}
defineProps<DataBrowserRouterProps>()

/** slots: ['fallback'] */
</script>

<template>
  <DataRouter
    :createRouter="
      (routes) =>
        createMemoryRouter({
          initialEntries,
          initialIndex,
          routes,
          hydrationData,
        })
    "
    :routes="routes"
  >
    <template #fallback>
      <slot name="fallback" />
    </template>

    <slot />
  </DataRouter>
</template>
