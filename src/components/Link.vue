<script lang="ts" type="module">
type LimitedMouseEvent = Pick<
    MouseEvent,
    "button" | "metaKey" | "altKey" | "ctrlKey" | "shiftKey"
>;

function isModifiedEvent(event: LimitedMouseEvent) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export function shouldProcessLinkClick(
    event: LimitedMouseEvent,
    target?: string
) {
    return (
        event.button === 0 && // Ignore everything but left clicks
        (!target || target === "_self") && // Let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // Ignore clicks with modifier keys
    );
}


/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 */
export function useLinkClickHandler<E extends Element = HTMLAnchorElement>(
    to: ComputedCallback<To>,
    {
        target,
        replace: replaceProp,
        state,
        resetScroll,
    }: {
        target?: Ref<string | undefined>;
        replace?: Ref<boolean | undefined>;
        state?: Ref<any>;
        resetScroll?: Ref<boolean | undefined>;
    } = {}
): (event: MouseEvent) => void {
    let navigate = useNavigate();
    let location = useLocation();
    let path = useResolvedPath(to);

    return (
        (event: MouseEvent) => {
            if (shouldProcessLinkClick(event, unwrap(target))) {
                event.preventDefault();

                // If the URL hasn't changed, a regular <a> will do a replace instead of
                // a push, so do the same here.
                let replace =
                    !!replaceProp || createPath(location.value!) === createPath(path.value);

                let newState = unwrap(state);
                if (unwrap(resetScroll) === false) {
                    newState = {
                        ...state,
                        __resetScrollPosition: false,
                    };
                }

                navigate(unwrap(to), { replace, state: newState });
            }
        }
    );
}
</script>

<script setup lang="ts">
import { createPath, To } from '@remix-run/router'
import { computed, Ref } from 'vue'
import { useHref, useLocation, useNavigate, useResolvedPath } from '..'
import { ComputedCallback, unwrap } from '../utils/useComputedCallback'

export interface LinkProps {
  reloadDocument?: boolean
  replace?: boolean
  state?: any
  resetScroll?: boolean
  to: To
  target?: string
}

const props = defineProps<LinkProps>()

const to = computed(() => props.to)

let href = useHref(to)

let internalOnClick = useLinkClickHandler(to, {
  replace: computed(() => props.replace),
  state: computed(() => props.state),
  target: computed(() => props.target),
  resetScroll: computed(() => props.resetScroll),
})

const emit = defineEmits<{
  (type: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  emit('click', event)

  if (!event.defaultPrevented && !props.reloadDocument) {
    internalOnClick(event)
  }
}
</script>

<template>
  <a :href="href" @click="handleClick">
    <slot></slot>
  </a>
</template>
