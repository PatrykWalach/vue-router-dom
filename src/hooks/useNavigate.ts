import { useHistory } from './useHistory'
import { resolvePath } from '../api/resolvePath'
import { useRouteContext } from '../hooks/useOutlet'
import { computed } from 'vue'

import type { State, To } from 'history'

export const useNavigate = () => {
  const history = useHistory()
  const context = useRouteContext()
  const pathname = computed(() => context.value.pathname)

  const navigate = (
    to: To | number,
    {
      state,
      replace = false,
    }: {
      state?: State
      replace: boolean
    },
  ) => {
    if (typeof to === 'number') {
      return history.go(to)
    }

    const path = resolvePath(to, pathname.value)
    ;(replace ? history.replace : history.push)(path, state)
  }

  return navigate
}
