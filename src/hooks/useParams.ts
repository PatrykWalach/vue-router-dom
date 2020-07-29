import { RouterParams } from '../api/types'
import { useRouteContext } from '../hooks/useOutlet'
import { computed } from 'vue'

export const useParams = <P extends RouterParams>() => {
  const context = useRouteContext()

  return computed(() => context.value.params)
}
