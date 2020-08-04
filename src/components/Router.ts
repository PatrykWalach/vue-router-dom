import {
  defineComponent,
  renderSlot,
  provide,
  inject,
  computed,
  watchEffect,
} from 'vue'
import { LOCATION_CONTEXT } from '../api/keys'
import { assert } from '../utils/assert'

import { Location, Action } from 'history'
import { Navigator } from '../api/types'

interface RouterProps {
  location: Location
  navigator: Navigator
  action: Action
  static: boolean
}

export const Router = defineComponent({
  name: 'Router',

  props: {
    location: { required: true, type: Object } as any,
    navigator: { required: true, type: Object } as any,
    action: { required: false, type: String, default: Action.Pop } as any,
    static: { required: false, type: Boolean, default: false },
  },

  setup(props: Readonly<RouterProps>, { slots }) {
    provide(LOCATION_CONTEXT, props)

    return () => renderSlot(slots, 'default')
  },
})
