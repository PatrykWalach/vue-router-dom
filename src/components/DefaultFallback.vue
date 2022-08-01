<script lang="ts" setup>
import { useRouteError } from '../remix/keys'

let error = useRouteError()
const style = {
  padding: '2px 4px',
  backgroundColor: 'rgba(200, 200, 200, 0.5)',
}
</script>

<template>
  <h2>Unhandled Thrown Error!</h2>
  <p :style="{ fontStyle: 'italic' }">{{ error?.message || error }}</p>
  <pre
    :style="{
      padding: '0.5rem',
      backgroundColor: 'rgba(200, 200, 200, 0.5)',
    }"
    v-if="error?.stack"
    >{{ error.stack }}</pre
  >
  <p>💿 Hey developer 👋</p>
  <p>
    You can provide a way better UX than this when your app throws errors by
    providing your own&nbsp;
    <code :style="style">errorElement</code> props on&nbsp;
    <code :style="style">&lt;Route&gt;</code>
  </p>
</template>
