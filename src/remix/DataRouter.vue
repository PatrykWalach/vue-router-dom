<script lang="ts"></script>

<script lang="ts" setup>
import {
  createBrowserRouter,
  HydrationState,
  RouteObject,
  Router as DataRouter,
} from '@remix-run/router'
import {
  defineComponent,
  onBeforeUnmount,
  onUnmounted,
  provide,
  shallowRef,
  watchEffect,
} from 'vue'
import { DataRouterKey, DataRouterStateKey } from './keys'
import { VueRouteObject, Navigator } from './types'
import Router from './Router.vue'
import Routes from './Routes.vue'
interface DataBrowserRouterProps {
  routes: VueRouteObject[]
  createRouter: (routes: VueRouteObject[]) => DataRouter
}

const props = defineProps<DataBrowserRouterProps>()

const router = props.createRouter(props.routes).initialize()

const state = shallowRef(router.state)

watchEffect((onCleanup) => {
  onCleanup(
    router.subscribe(() => {
      state.value = router.state
    }),
  )
})

const navigator: Navigator = {
  createHref: router.createHref,
  go: (n) => router.navigate(n),
  push: (to, state) => router.navigate(to, { state }),
  replace: (to, state) => router.navigate(to, { replace: true, state }),
}

provide(DataRouterKey, router)
provide(DataRouterStateKey, state)
</script>

<template>
  <slot v-if="!state.initialized" name="fallback" />
  <Router
    v-else
    :location="state.location"
    :navigationType="state.historyAction"
    :navigator="navigator"
  >
    <Routes :routes="routes">
      <slot />
    </Routes>
  </Router>
</template>
