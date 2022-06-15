<script lang="ts"></script>

<script lang="ts" setup>
import {
  createBrowserRouter,
  HydrationState,
  RouteObject,
  Router,
} from '@remix-run/router'
import { defineComponent, provide, shallowRef, toRefs } from 'vue'
import { DataRouterKey, DataRouterStateKey } from './keys'
import { VueRouteObject, Navigator } from './types'
import DataRouter from './DataRouter.vue'
interface DataBrowserRouterProps {
  hydrationData?: HydrationState
  routes: VueRouteObject[]
  window?: Window
}

defineProps<DataBrowserRouterProps>()
</script>

<template>
  <DataRouter
    :createRouter="
      (routes) =>
        createBrowserRouter({
          routes,
          hydrationData,
          window,
        })
    "
    :routes="routes"
  >
    <slot />
    <template #fallback>
      <slot name="fallback" />
    </template>
  </DataRouter>
</template>
