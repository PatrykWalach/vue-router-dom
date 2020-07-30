import { ref } from 'vue'

import type { Ref } from 'vue'
import type { ComputedCallback } from '../utils/computedCallback'

export const useSearchParams = (
  defaultInit?: ComputedCallback<URLSearchParamsInit>,
): Ref<URLSearchParams> => {
  return ref(new URLSearchParams())
}

type ParamKeyValuePair = [string, string]
type URLSearchParamsInit =
  | string
  | ParamKeyValuePair[]
  | Record<string, string | string[]>
  | URLSearchParams
