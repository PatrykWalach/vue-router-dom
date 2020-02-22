import { Ref, computed, inject } from 'vue'
import { ROUTE_PARAMS } from '../keys'
import { RouterParams } from '../types'

export const useParams = <T extends RouterParams>() =>
  inject(
    ROUTE_PARAMS,
    computed(() => ({})),
  ) as Ref<T>
