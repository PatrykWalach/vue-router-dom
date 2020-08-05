<script lang="ts">
import Outlet from './Outlet.vue'

import { defineComponent, PropType } from 'vue'

import { VNode } from 'vue'

export default defineComponent({
  name: 'Route',

  props: {
    path: {
      default: '',
      required: false,
      type: String,
    },
    caseSensitive: {
      default: false,
      required: false,
      type: Boolean,
    },
    element: {
      default: () => Outlet,
      required: false,
      type: Object as PropType<VNode>,
    },
  },
})
</script>

<template>
  <slot name="element">
    <component :is="element" />
  </slot>
</template>
