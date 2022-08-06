<script lang="ts" setup>
import { useAsyncValue } from '~/remix/hooks.js'

let data = useAsyncValue()
</script>
<template>
  <slot :data="data"></slot>
</template>
