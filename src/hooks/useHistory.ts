import { ROUTER_HISTORY } from '../keys'
import { inject } from 'vue'
import { throwError } from '../utils'

export const useHistory = () =>
  inject(ROUTER_HISTORY, {
    push: throwError,
  })
