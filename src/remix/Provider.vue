<script lang="ts" setup>

import { computed, InjectionKey,provide } from 'vue'

const { key, value } = defineProps<{ key: InjectionKey<unknown>; value: unknown }>()

provide(key, value)
</script>

<template><slot /></template>
