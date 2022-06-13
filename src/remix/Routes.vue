<script lang="ts" setup>
import * as vue from 'vue'
import { VueRouteObject } from './types'
import { useRoutes } from './useRoutes'

interface RoutesProps {
  routes?: VueRouteObject[]
  location?: Partial<Location> | string
}

const props = defineProps<RoutesProps>()

const component = useRoutes(
  vue.computed(() => props.routes || []),
  vue.computed(() => props.location),
)
</script>

<template>
  <component :is="component" />
</template>
