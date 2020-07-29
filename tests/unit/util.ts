import { createMemoryHistory } from 'history'
import { Component, Slot, Directive, ComponentOptions } from 'vue'
import { mount } from '@vue/test-utils'
import { ROUTER_HISTORY } from '../../src'

interface MountingOptions {
  data?: () => Record<string, unknown>
  props?: Record<string, any>
  slots?: {
    default?: Slot
    [key: string]: Slot
  }
  global?: {
    plugins?: Plugin[]
    mixins?: ComponentOptions[]
    mocks?: Record<string, any>
    provide?: Record<any, any>
    components?: Record<string, Component | object>
    directives?: Record<string, Directive>
  }
  stubs?: Record<string, any>
}


