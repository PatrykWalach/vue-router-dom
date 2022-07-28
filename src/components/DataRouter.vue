<script lang="ts">
export function enumerate(
  routes: VueRouteObject[] | undefined,
  parentId: string = '',
): VueRouteObject[] | undefined {
  return routes?.map(({ children, id, ...route }, i) => {
    id ??= parentId ? parentId + '-' + i : String(i)

    return {
      id,
      ...route,
      children: enumerate(children, id),
    }
  })
}

// const enumeratedRoutes = enumerate(props.routes)
</script>

<script lang="ts" setup>
import { invariant } from '@remix-run/router'
import { inject } from 'vue'
import { DataRouterKey, useDataRouter } from '../remix/keys'
import { VueRouteObject } from '../remix/types'
import Routes from './Routes.vue'
import Router from './Router.vue'

const dataRouter = useDataRouter()

invariant(
  dataRouter,
  '<DataRouter> may only be rendered within a DataRouterKey',
)

const { router, basename, navigator } = dataRouter
</script>

<template>
  <Router
    :basename="basename"
    :location="router.state.location"
    :navigationType="router.state.historyAction"
    :navigator="navigator"
  >
    <Routes>
      <slot />
    </Routes>
  </Router>
</template>
