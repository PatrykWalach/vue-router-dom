<script setup lang="ts">
import { Location } from '@remix-run/router'
import * as vue from 'vue'
import { watchEffect } from 'vue'
import { useDataRouter } from '../remix/keys'
import { VueRouteObject } from '../remix/types'
import { useRoutes } from '../remix/useRoutes'
import { enumerate } from './DataRouter.vue'
interface RoutesProps {
  location?: Partial<Location> | string
  routes?: VueRouteObject[]
}

const props = defineProps<RoutesProps>()
const dataRouter = useDataRouter()

const component = useRoutes(
  vue.computed(
    () => enumerate(props.routes) || dataRouter?.router.routes || [],
  ),
  vue.computed(() => props.location),
)
</script>

<template>
  <slot :component="component">
    <component :is="component" />
  </slot>
</template>
