import { onBeforeUnmount, readonly, ref } from 'vue'
import qs from 'querystringify'
import { useHistory } from './useHistory'
import { Location } from 'history'

const locationToRoute = (location: Location) => ({
  query: qs.parse(location.search),
  ...location,
})

export const useLocation = () => {
  const history = useHistory()

  const location = ref(locationToRoute(history.location))

  const unlisten = history.listen((newLocation) => {
    location.value = locationToRoute(newLocation)
  })

  onBeforeUnmount(unlisten)

  return readonly(location)
}
