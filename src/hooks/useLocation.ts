import { HashLocation, Location } from 'history'
import { Ref, computed, inject } from 'vue'
import { ROUTER_LOCATION } from '../keys'
import { throwError } from '../utils'

export const useLocation = <T extends Location | HashLocation = Location>() =>
  inject(ROUTER_LOCATION, computed(throwError)) as Readonly<Ref<T>>
