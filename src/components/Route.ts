import { Outlet } from './Outlet'

import { defineComponent, h, renderSlot, Component, PropType } from 'vue'

import type { VNode } from 'vue'

export const Route = defineComponent({
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
      type: [Object,Function] as PropType<Component>,
    },
  },

  setup(props, { slots }) {
    return () =>
      renderSlot(slots, 'element', undefined, () => [h(props.element)])
  },
})
