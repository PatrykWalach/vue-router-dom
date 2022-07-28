<script setup lang="ts">
import * as vue from 'vue'
import { VueRouteObject } from '../remix/types'
import { useRoutes } from '../remix/useRoutes'
import { Location } from '@remix-run/router'
import { PropType } from 'vue'
import { useDataRouter } from '../remix/keys'
interface RoutesProps {
  location?: Partial<Location> | string
}

const props = defineProps<RoutesProps>()
const dataRouter = useDataRouter()

const component = useRoutes(
  vue.computed(() => dataRouter?.router.routes || []),
  vue.computed(() => props.location),
)
</script>

<template>
  <slot :component="component">
    <component :is="component" />
  </slot>
</template>
