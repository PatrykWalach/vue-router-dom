import { inject, InjectionKey, Ref, computed } from 'vue'
import { RouterMatch, RouterParams } from '../api/types'
import { CLOSEST_MATCH } from '../api/keys'

export const useMatch = <Params extends RouterParams = RouterParams>() =>
  inject<Ref<RouterMatch<Params> | null>>(
    CLOSEST_MATCH,
    computed(() => null),
  )
