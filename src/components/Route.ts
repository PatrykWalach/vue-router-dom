import { defineComponent, h, Slot, Component } from 'vue'
import { useRouteMatch } from '../hooks/useRouteMatch'
import { WithRouter } from './WithRouter'
import { PartialLocation } from 'history'

export interface RouteProps {
  exact: boolean
  strict: boolean
  path: string | string[]
  component: Component
  sensitive: boolean
  location: PartialLocation
}

const renderWithProps = (slot: Slot) => h(WithRouter, {}, { default: slot })

export const Route = defineComponent({
  name: 'Route',

  props: {
    exact: {
      default: false,
      required: false,
      type: Boolean,
    },
    path: {
      default: '',
      required: false,
      type: [String, Array],
    } as any,
    strict: {
      default: false,
      required: false,
      type: Boolean,
    },
    sensitive: {
      default: false,
      required: false,
      type: Boolean,
    },
    location: {
      default: () => ({}),
      required: false,
      type: Object,
    },
    component: {
      default: null,
      required: false,
      type: [Object, Function],
    },
  },

  setup(props: Readonly<RouteProps>, { slots }) {
    const match = useRouteMatch(
      () => props,
      () => props.location,
    )

    return () => {
      const { children, default: standard } = slots

      const matchValue = match.value

      if (children) {
        return renderWithProps(children)
      }

      if (props.component) {
        return (
          matchValue &&
          renderWithProps((routerProps) => [h(props.component, routerProps)])
        )
      }

      return matchValue && standard && renderWithProps(standard)
    }
  },
})
