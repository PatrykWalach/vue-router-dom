import { onBeforeUnmount, readonly, ref, computed } from 'vue'
import { useHistory } from './useHistory'

export const useLocation = () => {
  const history = useHistory()

  const location = ref(history.location)

  const unlisten = history.listen((update) => {
    location.value = update.location
  })

  onBeforeUnmount(unlisten)

  return computed(() => location.value)
}
