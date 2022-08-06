<script lang="ts" setup>
import type { TrackedPromise } from '@remix-run/router'
import AwaitErrorBoundary from './AwaitErrorBoundary.vue'
import AwaitResolve from './AwaitResolve.vue'

export interface AwaitProps {
  resolve: TrackedPromise | any
}

defineProps<AwaitProps>()
</script>
<template>
  <AwaitErrorBoundary :resolve="resolve">
    <template #error>
      <slot name="error"></slot>
    </template>
    <AwaitResolve v-slot="{ data }">
      <slot :data="data"></slot>
    </AwaitResolve>
  </AwaitErrorBoundary>
</template>
