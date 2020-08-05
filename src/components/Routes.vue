<script lang="ts">
import { defineComponent, computed, renderSlot } from 'vue'
import { useRoutes_ } from '../hooks/useRoutes'
import { createRoutesFromChildren } from '../api/createRoutesFromChildren'

export default defineComponent({
  name: 'Routes',

  props: { basename: { default: '', required: false, type: String } },

  setup(props, { slots }) {
    const routes = computed(() =>
      createRoutesFromChildren([renderSlot(slots, 'default')]),
    )

    const element = useRoutes_(routes, () => props.basename)

    return { element }
  },
})
</script>

<template>
  <component :is="element" />
</template>
