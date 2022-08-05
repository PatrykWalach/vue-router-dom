<script lang="ts" setup>
import { Location } from '@remix-run/router'
import * as vue from 'vue'
import { RouteErrorKey } from '../remix/keys'

interface Props {
  location: Location
  error: Error | null
}

const props = defineProps<Props>()

let captured = vue.shallowRef<Error>()
let error = vue.computed(() => props.error ?? captured.value ?? null)

vue.onErrorCaptured((error) => {
  captured.value = error
  return false
})

vue.provide(RouteErrorKey, error)
</script>

<template>
  <slot name="fallback" v-if="error" />
  <slot v-else />
</template>
