<script setup lang="ts">
import * as vue from 'vue'
import { VueRouteObject } from './types'
import { useRoutes } from './useRoutes'
import { Location } from '@remix-run/router'
import { PropType } from 'vue'
interface RoutesProps {
  routes?: VueRouteObject[]
  location?: Partial<Location> | string
}

const props = defineProps({
  routes: { required: false, type: Array as PropType<VueRouteObject[]> },
  location: {
    required: false,
    type: [Object, String] as PropType<Partial<Location> | string>,
  },
})

// const props = defineProps<RoutesProps>()

const component = useRoutes(
  vue.computed(() => props.routes || []),
  vue.computed(() => props.location),
)
</script>

<template>
  <slot :component="component">
    <component :is="component" />
  </slot>
</template>
