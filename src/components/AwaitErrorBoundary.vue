<script lang="ts" setup>
import type { TrackedPromise } from '@remix-run/router'
import {
  computed,
  customRef,
  onErrorCaptured,
  provide,
  ref,
  shallowRef,
  triggerRef,
  useSlots,
  watch,
  watchEffect,
} from 'vue'
import { AwaitKey } from '~/remix/keys.js'
export interface Props {
  resolve: TrackedPromise | unknown
}

enum AwaitRenderStatus {
  pending,
  success,
  error,
}

const props = defineProps<Props>()

const error = ref<Error>()

onErrorCaptured((capturedError, _, info) => {
  console.error(
    '<Await> caught the following error during render',
    capturedError,
    info,
  )

  error.value = capturedError

  return false
})

function isTrackedPromise(v: unknown): v is TrackedPromise {
  return !!(v as TrackedPromise)._tracked
}

const promise = customRef((track, trigger) => ({
  set() {},
  get: (): TrackedPromise => {
    track()

    if (!(props.resolve instanceof Promise)) {
      let promise = Promise.resolve()
      Object.defineProperties(promise, {
        _tracked: { value: true },
        _data: { value: props.resolve },
      })
      return promise
    }

    if (error.value) {
      let promise = Promise.reject().catch(() => {})
      Object.defineProperties(promise, {
        _tracked: { value: true },
        _error: { value: error.value },
      })

      return promise
    }

    if (isTrackedPromise(props.resolve)) {
      return props.resolve
    }

    Object.defineProperty(props.resolve, '_tracked', { value: true })

    return props.resolve
      .then(
        (value) =>
          Object.defineProperty(props.resolve, '_data', { value: value }),
        (value) => {
          Object.defineProperty(props.resolve, '_error', { value })
        },
      )
      .finally(() =>
        // rerender
        trigger(),
      )
  },
}))

const status = computed((): AwaitRenderStatus => {
  return promise.value._error !== undefined
    ? AwaitRenderStatus.error
    : promise.value._data !== undefined
    ? AwaitRenderStatus.success
    : AwaitRenderStatus.pending
})

provide(AwaitKey, promise)

await promise.value
</script>
<template>
  <slot name="error" v-if="status === AwaitRenderStatus.error">
    {{
      (() => {
        throw promise._error
      })()
    }}
  </slot>
  <slot v-else-if="status === AwaitRenderStatus.success"></slot>
</template>
