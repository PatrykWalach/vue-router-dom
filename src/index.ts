export * from './remix/keys'
export * from './remix/types'
export * from './remix/hooks'
export { default as DataBrowserRouter } from './components/DataBrowserRouter.vue'
export { default as DataMemoryRouter } from './components/DataMemoryRouter.vue'
export { default as BrowserRouter } from './components/BrowserRouter.vue'
export { default as MemoryRouter } from './components/MemoryRouter.vue'
export { default as Link } from './components/Link.vue'
export { default as Outlet } from './components/Outlet.vue'
export { default as Await } from './components/Await.vue'
export { default as Routes } from './components/Routes.vue'

export { useRoutes } from './remix/useRoutes'

export type { VueRouteObject as RouteObject, Handle } from './remix/types'

export { defer } from '@remix-run/router'
export type {
  LoaderFunction,
  LoaderFunctionArgs,
  ActionFunction,
  ActionFunctionArgs,
  ShouldRevalidateFunction,
} from '@remix-run/router'
