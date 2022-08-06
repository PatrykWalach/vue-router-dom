<script lang="ts" setup>
import { isRouteErrorResponse } from '@remix-run/router'
import { computed } from 'vue'
import { useRouteError } from '../remix/keys'

let error = useRouteError()

const message = computed(() =>
  isRouteErrorResponse(error.value)
    ? `${error.value.status} ${error.value.statusText}`
    : error instanceof Error
    ? error.value.message
    : JSON.stringify(error.value),
)

const stack = computed(() =>
  error instanceof Error ? error.value.stack : null,
)

const style = {
  padding: '2px 4px',
  backgroundColor: 'rgba(200, 200, 200, 0.5)',
}
</script>

<template>
  <h2>Unhandled Thrown Error!</h2>
  <p :style="{ fontStyle: 'italic' }">{{ message }}</p>
  <pre
    :style="{
      padding: '0.5rem',
      backgroundColor: 'rgba(200, 200, 200, 0.5)',
    }"
    v-if="stack"
    >{{ stack }}</pre
  >
  <p>💿 Hey developer 👋</p>
  <p>
    You can provide a way better UX than this when your app throws errors by
    providing your own&nbsp;
    <code :style="style">errorElement</code> props on&nbsp;
    <code :style="style">&lt;RouteObject&gt;</code>
  </p>
</template>
