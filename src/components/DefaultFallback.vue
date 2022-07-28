<script lang="ts" setup>
import { useRouteError } from '../remix/keys'

let error = useRouteError()
</script>

<template>
  <h2>Unhandled Thrown Error!</h2>
  <p :style="{ fontStyle: 'italic' }">{{ error?.message || error }}</p>
  <pre v-if="error?.stack">{{ error.stack }}</pre>
  <p>💿 Hey developer 👋</p>
  <p>
    You can provide a way better UX than this when your app throws errors by
    providing your own&nbsp;
    <code>errorElement</code> props on&nbsp;
    <code>&lt;Route&gt;</code>
  </p>
</template>

<style scoped>
code {
  padding: 2px 4px;
  background-color: rgba(200, 200, 200, 0.5);
}
pre {
  padding: 0.5rem;
  background-color: rgba(200, 200, 200, 0.5);
}
</style>
