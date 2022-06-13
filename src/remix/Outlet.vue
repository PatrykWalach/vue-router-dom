<script lang="ts" setup>
import { useOutlet } from './keys'
import { computed } from 'vue'

const props = defineProps<{ context?: unknown }>()

const component = useOutlet(computed(() => props.context))
</script>

<template>
  <component :is="component" />
</template>
