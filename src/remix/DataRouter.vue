<script lang="ts" setup>
/** slots: ['fallback'] */
import {
    createBrowserRouter,
    HydrationState,
    RouteObject, Router as DataRouter
} from '@remix-run/router'
import { onBeforeUnmount, onUnmounted, provide, shallowRef } from 'vue'
import { DataRouterContext, DataRouterStateContext } from './keys'
import { VueRouteObject, Navigator } from './types'

import Router from './Router.vue'
import Routes from './Routes.vue'

interface DataBrowserRouterProps {
    routes: VueRouteObject[]
    createRouter: (routes: VueRouteObject[]) => DataRouter
}


const { routes, createRouter } = defineProps<DataBrowserRouterProps>()

const router = createRouter(routes).initialize()

const state = shallowRef(router.state)

const unsubscribe = router.subscribe(() => {
    state.value = router.state
})

onBeforeUnmount(() => {
    unsubscribe()
})

const navigator: Navigator = {
    createHref: router.createHref,
    go: (n) => router.navigate(n),
    push: (to, state) => router.navigate(to, { state }),
    replace: (to, state) => router.navigate(to, { replace: true, state }),
}

provide(DataRouterContext, router)
provide(DataRouterStateContext, state)
</script>

<template>
    <slot v-if="!state.initialized" name="fallback" />
    <Router v-else :location="state.location" :navigationType="state.historyAction" :navigator="navigator">
        <Routes :routes="routes">
            <slot />
        </Routes>
    </Router>
</template>
