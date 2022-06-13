<script lang="ts" setup>
import { normalizePathname, parsePath, stripBasename, warning, Action as NavigationType, Location, } from '@remix-run/router';
import { computed, provide, toRef, watchEffect } from 'vue';
import { LocationContext, NavigationContext, Navigator } from './keys';

interface RouterProps {
    basename?: string;
    location: Partial<Location> | string;
    navigationType?: NavigationType;
    navigator: Navigator;
    static?: boolean;
}

const props = defineProps<RouterProps>();

const basenameProp = computed(() => props.basename ?? "/",)

const navigationType = computed(() => props.navigationType ?? NavigationType.Pop)
const navigator = toRef(props, 'navigator')

const staticProp = computed(() => props.static ?? false)



let basename = computed(() => normalizePathname(basenameProp.value));


const locationProp = computed(() => typeof props.location === "string" ? parsePath(props.location) : props.location)


const pathname = computed(() => locationProp.value.pathname ?? "/",)
const search = computed(() => locationProp.value.search ?? "",)
const hash = computed(() => locationProp.value.hash ?? "",)
const state = computed(() => locationProp.value.state ?? null)
const key = computed(() => locationProp.value.key ?? "default")



let location = computed((): Location | null => {
    let trailingPathname = stripBasename(pathname.value, basename.value);

    if (trailingPathname == null) {
        return null;
    }

    return {
        pathname: trailingPathname,
        search: search.value,
        hash: hash.value,
        state: state.value,
        key: key.value,
    };
});

watchEffect(() => {
    warning(
        location.value != null,
        `<Router basename="${basename.value}"> is not able to match the URL ` +
        `"${pathname.value}${search.value}${hash.value}" because it does not start with the ` +
        `basename, so the <Router> won't render anything.`
    );
})



provide(NavigationContext, { basename, navigator, static: staticProp });
provide(LocationContext, { location, navigationType });
</script>

<template >
    <slot v-if="location" />
</template>