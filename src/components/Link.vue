<script lang="ts">
import { defineComponent, toRefs, PropType } from 'vue'
import { useLocation } from '../hooks/useLocation'
import { useNavigate } from '../hooks/useNavigate'
import { createPath } from 'history'
import { useResolvedPath } from '../hooks/useResolvedPath'
import { useHref } from '../hooks/useHref'

import { To, State } from 'history'

export default defineComponent({
  name: 'Link',

  props: {
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
  },

  emits: { click: null },

  setup(props, { emit }) {
    const { to, replace } = toRefs(props)
    const href = useHref(to)
    const location = useLocation()
    const path = useResolvedPath(to)

    const navigate = useNavigate()

    const handleClick = (event: MouseEvent) => {
      emit('click', event)
      event.stopPropagation()
      event.preventDefault()

      const pathValue = path.value

      // If the URL hasn't changed, replace instead of push.
      const replaceValue =
        !!replace.value || createPath(location.value) === createPath(pathValue)

      navigate(pathValue, {
        replace: replaceValue,
        state: props.state,
      })
    }

    return { href, handleClick }
  },
})
</script>

<template>
  <component :is="tag" :href="href" @click="handleClick"><slot /></component>
</template>
