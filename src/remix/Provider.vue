<script lang="ts" setup>
import { computed, InjectionKey, provide, Ref } from 'vue'

const props = defineProps<{
  injectionKey: InjectionKey<Readonly<Ref<unknown>>>
  value: unknown
}>()

provide(
  props.injectionKey,
  computed(() => props.value),
)
</script>

<template>
  <slot />
</template>
