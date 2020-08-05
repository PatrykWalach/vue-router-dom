<template>
  <RouterLink
    v-bind="{ style, to }"
    :class="className"
    :aria-current="ariaCurrentName"
  >
    <slot />
  </RouterLink>
</template>

<script lang="ts">
import Link from './Link.vue'

import { computed, defineComponent, toRefs, PropType } from 'vue'
import { useLocation } from '../hooks/useLocation'
import { useResolvedPath } from '../hooks/useResolvedPath'
import { useComputedCallback } from '../utils/useComputedCallback'

import { ComputedCallback } from '../utils/useComputedCallback'
import { State, To } from 'history'

const useCaseSensitive = (
  caseSensitiveValue: ComputedCallback<boolean>,
  stringValue: ComputedCallback<string>,
) => {
  const caseSensitive = useComputedCallback(caseSensitiveValue)
  const string = useComputedCallback(stringValue)

  return computed(() => {
    const stringValue = string.value
    return caseSensitive.value ? stringValue : stringValue.toLowerCase()
  })
}

export default defineComponent({
  name: 'NavLink',

  components: { RouterLink: Link },

  props: {
    activeClassName: {
      default: '',
      required: false,
      type: String,
    },
    activeStyle: {
      default: () => ({}),
      required: false,
      type: Object as PropType<Record<string, string>>,
    },
    caseSensitive: {
      default: false,
      required: false,
      type: Boolean,
    },
    end: {
      default: false,
      required: false,
      type: Boolean,
    },
    replace: {
      default: false,
      required: false,
      type: Boolean,
    },
    tag: {
      default: 'a',
      required: false,
      type: String,
    },
    to: { default: '', required: true, type: [String, Object] as PropType<To> },
    state: {
      default: undefined,
      required: false,
      type: Object as PropType<State>,
    },
    ariaCurrent: { default: 'page', type: String, required: false },
  },

  setup(props) {
    const location = useLocation()
    const { to, caseSensitive } = toRefs(props)
    const path = useResolvedPath(to)

    const locationPathname = computed(() => location.value.pathname)
    const toPathname = computed(() => path.value.pathname)

    const caseSensitiveLocationPathname = useCaseSensitive(
      caseSensitive,
      locationPathname,
    )
    const caseSensitiveToPathname = useCaseSensitive(caseSensitive, toPathname)

    const isActive = computed(() => {
      const locationPathname = caseSensitiveLocationPathname.value
      const toPathname = caseSensitiveToPathname.value
      return props.end
        ? locationPathname === toPathname
        : locationPathname.startsWith(toPathname)
    })

    const ariaCurrent = computed(() =>
      isActive.value ? props.ariaCurrent : undefined,
    )

    const className = computed(() => isActive.value && props.activeClassName)

    const style = computed(() => isActive.value && props.activeStyle)

    return {
      style,
      className,
      ariaCurrentName: ariaCurrent,
    }
  },
})
</script>
