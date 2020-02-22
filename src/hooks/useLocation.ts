import { readonly, ref, watch } from 'vue'

import { useHistory } from './useHistory'

export const useLocation = () => {
  const history = useHistory()

  const location = ref(history.location)

  watch(
    () => history,
    (history, prevHistory, onCleanup) => {
      const unlisten = history.listen(newLocation => {
        location.value = newLocation
      })

      onCleanup(unlisten)
    },
    { immediate: true },
  )

  return readonly(location)
}
