<script lang="ts">
import { defineComponent } from 'vue'
import { useOutlet } from '../hooks/useOutlet'

export default defineComponent({
  name: 'Outlet',

  setup() {
    const outletElement = useOutlet()

    return { outletElement }
  },
})
</script>

<template>
  <component :is="outletElement" />
</template>
