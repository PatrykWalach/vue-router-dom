import { useRouteContext } from '../hooks/useOutlet'
import { computed, toRef } from 'vue'

import type { RouterParams } from '../api/types'

export const useParams = <P extends RouterParams>() => {
  return toRef(useRouteContext<P>(), 'params')
}
