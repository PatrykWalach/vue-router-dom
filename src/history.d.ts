declare module 'history' {
  interface RouterLocation<S = unknown> {
    pathname: string
    search: string
    hash: string
    state: S
  }

  interface RouterMemoryLocation<S = unknown> extends RouterLocation<S> {
    key: string
  }

  enum Action {
    PUSH = 'PUSH',
    REPLACE = 'REPLACE',
    POP = 'POP',
  }
  interface RouterMemoryHistory<L = RouterMemoryLocation>
    extends RouterHistory<L> {
    canGo(index: number): boolean
    index: number
    entries: RouterMemoryLocation[]
  }

  type Unlisten = () => void
  type Listener<L> = (location: L, action: Action) => void
  type Blocker<L> = (location: L, action: Action) => string
  interface RouterHistory<L = RouterLocation> {
    length: number
    action: Action
    location: L
    createHref(path: Partial<RouterPath>): string
    block(prompt: string | Blocker<L>): Unlisten
    listen(listener: Listener<L>): Unlisten
    push(path: Partial<RouterPath> | string): void
    push(path: string, state: any): void
    replace(path: Partial<RouterPath> | string): void
    replace(path: string, state: any): void
    go(n: number): void
    goBack(): void
    goForward(): void
  }

  interface RouterPath<S = unknown> {
    pathname: string
    search: string
    hash: string
    state: S
  }

  enum HashType {
    slash = 'slash',
    noslash = 'noslash',
    hashbang = 'hashbang',
  }

  type GetUserConfirmation = (
    message: string,
    next: (go: boolean) => void,
  ) => void
  interface HistoryOptions {
    getUserConfirmation?: GetUserConfirmation
  }
  interface BrowserHistoryOptions extends HistoryOptions {
    basename?: string
    forceRefresh?: boolean
    keyLength?: number
  }

  interface HashHistoryOptions extends HistoryOptions {
    basename?: string
    hashType?: HashType
  }

  interface MemoryHistoryOptions extends HistoryOptions {
    initialEntries?: string[]
    initialIndex?: number
    keyLength?: number
  }

  type CreateBrowserHistory = (options?: BrowserHistoryOptions) => RouterHistory
  type CreateHashHistory = (options?: HashHistoryOptions) => RouterHistory
  type CreateMemoryHistory = (
    options?: MemoryHistoryOptions,
  ) => RouterMemoryHistory

  export const createBrowserHistory: CreateBrowserHistory
  export const createHashHistory: CreateHashHistory
  export const createMemoryHistory: CreateMemoryHistory
}
