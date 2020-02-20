import { computed, inject } from 'vue'
import { ROUTER_LOCATION } from '../keys'
import { throwError } from '../utils'

export const useLocation = () => inject(ROUTER_LOCATION, computed(throwError))
