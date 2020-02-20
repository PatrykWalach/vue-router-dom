import { Ref } from 'vue'

export interface RouterLocation {
  hash: string
  pathname: string
  search: string
}
export interface RouterHistory {
  push(newPath: string): void
}
export type RouterParams = Record<string, string>

export type ComputedCallback<T> = Ref<T> | (() => T)

export type UnregisterParams = () => void
export type RegisterParams = (route: string) => UnregisterParams
