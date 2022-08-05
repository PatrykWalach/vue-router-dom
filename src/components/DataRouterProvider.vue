<script lang="ts" setup>
import { Router as RemixRouter } from '@remix-run/router'
import { computed, provide, shallowRef, watchEffect } from 'vue'
import {
  DataRouterKey,
  DataRouterKeyObject,
  DataRouterStateKey,
  Navigator,
} from '../remix/keys'

interface DataBrowserRouterProps {
  basename?: string

  router: RemixRouter
}

const props = defineProps<DataBrowserRouterProps>()

const state = shallowRef(props.router.state)

watchEffect((onCleanup) => {
  onCleanup(
    props.router.subscribe(() => {
      state.value = props.router.state
    }),
  )
})

const navigator: Navigator = {
  createHref: props.router.createHref,
  go: (n) => props.router.navigate(n),
  push: (to, state, opts) =>
    props.router.navigate(to, { state, resetScroll: opts?.resetScroll }),
  replace: (to, state, opts) =>
    props.router.navigate(to, {
      replace: true,
      state,
      resetScroll: opts?.resetScroll,
    }),
}

let dataRouter: DataRouterKeyObject = {
  router: props.router,
  navigator,
  static: computed(() => false),
  basename: computed(() => props.basename || '/'),
}

provide(DataRouterKey, dataRouter)
provide(DataRouterStateKey, state)
</script>

<template>
  <slot v-if="!state.initialized" name="fallback" />
  <slot v-else></slot>
</template>
