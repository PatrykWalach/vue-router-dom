<script lang="ts" setup>
import * as vue from 'vue'
import { RouteErrorContext } from './keys'

interface Props {
  location: Location
  error: Error | null
  component: vue.Component
}

const props = defineProps<Props>()

let captured = vue.shallowRef<Error>()
let error = vue.computed(() => props.error || captured.value)

vue.onErrorCaptured((error) => {
  captured.value = error
})

vue.provide(RouteErrorContext, error)
</script>

<template>
  <slot name="fallback" v-if="error" />
  <slot v-else />
</template>
