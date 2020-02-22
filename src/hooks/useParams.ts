import { Ref, computed } from 'vue'
import { ROUTE_PARAMS } from '../keys'
import { RouterParams } from '../types'
import { inject } from 'vue'

export const useParams = <T extends RouterParams>() =>
  inject(
    ROUTE_PARAMS,
    computed(() => ({})),
  ) as Ref<T>
