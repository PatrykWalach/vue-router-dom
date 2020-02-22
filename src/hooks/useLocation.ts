import { onBeforeUnmount, readonly, ref } from 'vue'

import { useHistory } from './useHistory'

export const useLocation = () => {
  const history = useHistory()

  const location = ref(history.location)

  const unlisten = history.listen(newLocation => {
    location.value = newLocation
  })

  onBeforeUnmount(unlisten)

  return readonly(location)
}
