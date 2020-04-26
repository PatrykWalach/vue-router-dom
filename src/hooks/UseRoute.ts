import { useLocation } from './useLocation'
import { computed } from 'vue'
import { Location } from 'history'
import qs from 'querystringify'
import { RouterQuery, RouterRoute } from '../api/types'

const locationToRoute = <Query extends RouterQuery>(
  location: Location,
): RouterRoute<Query> => ({
  path: location.pathname,
  hash: location.hash,
  query: qs.parse(location.search) as Query,
  fullPath: location.pathname + location.search + location.hash,
})

export const useRoute = <Query extends RouterQuery = RouterQuery>() => {
  const location = useLocation()

  return computed(() => locationToRoute<Query>(location.value))
}
