import { Outlet } from './Outlet'

import { defineComponent, h } from 'vue'

import type{ VNode } from 'vue'
export interface RouteProps {
  caseSensitive: boolean
  element: VNode
  path: string
}

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
      default: () => h(Outlet),
      required: false,
      type: null,
    },
  },

  setup(props: Readonly<RouteProps>) {
    return () => props.element
  },
})
