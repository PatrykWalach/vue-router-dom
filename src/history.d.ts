declare module 'history' {
  interface HashLocation {
    pathname: string
    search: string
    hash: string
  }

  interface Location extends HashLocation {
    state: any
    key: string
  }

  type Action = 'PUSH' | 'REPLACE' | 'POP'

  type Listener = (location: Location, action: Action) => any
  type HashListener = (location: HashLocation, action: Action) => any

  type Listen<Listener> = (listener: Listener) => HistoryUnlisten
  type HistoryUnlisten = () => void

  interface Path {
    pathname?: string
    search?: string
    hash?: string
    state?: any
  }

  interface BaseHistory {
    push(path: Path): void
    push(path: string, state?: any): void
    replace(path: Path): void
    replace(path: string, state?: any): void
    go(n: number): void
    goBack(): void
    goForward(): void
    length: number
    action: Action
  }

  interface HashHistory extends BaseHistory {
    location: HashLocation
    listen: Listen<HashListener>
  }

  interface BrowserHistory extends BaseHistory {
    location: Location
    listen: Listen<Listener>
  }

  interface MemoryHistory extends BrowserHistory {
    canGo(n: number): void
    index: number
    entries: string[]
  }

  interface BrowserHistoryOptions {
    basename?: string
    forceRefresh?: boolean
    keyLength?: number
    getUserConfirmation?: Function
  }

  interface HashHistoryOptions {
    basename?: string
    hashType?: string
    getUserConfirmation?: Function
  }

  interface MemoryHistoryOptions {
    initialEntries?: string[]
    initialIndex?: number
    keyLength?: number
    getUserConfirmation?: Function
  }

  type CreateBrowserHistory = (
    options?: BrowserHistoryOptions,
  ) => BrowserHistory
  type CreateHashHistory = (options?: HashHistoryOptions) => HashHistory
  type CreateMemoryHistory = (options?: MemoryHistoryOptions) => MemoryHistory

  export const createBrowserHistory: CreateBrowserHistory
  export const createHashHistory: CreateHashHistory
  export const createMemoryHistory: CreateMemoryHistory
}
