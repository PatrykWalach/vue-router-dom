import { RouterParams } from '../api/types'
import { useMatch } from './useMatch'
import { useMatchToParams } from '../utils/useMatchToParams'

export const useParams = <P extends RouterParams>() => {
  const match = useMatch<P>()

  return useMatchToParams(match)
}
