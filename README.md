# vue-router-dom [![CircleCI](https://circleci.com/gh/PatrykWalach/vue-router-dom.svg?style=svg)](https://circleci.com/gh/PatrykWalach/vue-router-dom) [![codecov](https://codecov.io/gh/PatrykWalach/vue-router-dom/branch/master/graph/badge.svg)](https://codecov.io/gh/PatrykWalach/vue-router-dom) ![](https://img.shields.io/npm/v/vue-router-dom)

`vue-router-dom` is an implementation of [react-router](https://reacttraining.com/react-router/web/guides/philosophy) for vue 3, providing components and hooks for routing.

## Table of contents

- [Install](#install)
- [Tree Shaking](#Tree-Shaking)
- [API](#api)
- [Non-standard APIs](#Non-standard-APIs)
  - [Default](#default)
  - [Components](#Components)
    - [Route](#Route)
      - [render: func](#render:-func)
      - [children: func](#children:-func)
    - [WithRouter](#WithRouter)
    - [Prompt](#Prompt)
    - [Routers](#Routers)
  - [With](#Routers)

## Install

```sh
npm i vue-router-dom
```

## Tree Shaking

If you don't want to register components globally,
[`history`](#history) can be provided manually without installation.

```typescript
import { ROUTER_HISTORY, createBrowserHistory } from 'vue-router-dom'
import { createApp } from 'vue'
import App from './App.vue'

const history = createBrowserHistory()

const app = createApp(App).provide(ROUTER_HISTORY, history)

app.mount('#app')
```

## API

For API documentaiton, please visit
[React Router API](https://reacttraining.com/react-router/web/api).

## Non-standard APIs

### default

The default export provides install function that registers all the components globally and by default provides a browser [`history`](#history)

```typescript
import VueRouterDom from 'vue-router-dom'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App).use(VueRouterDom)

app.mount('#app')
```

Other types of history can be used if needed.

```typescript
import VueRouterDom, { createHashHistory } from 'vue-router-dom'
import { createApp } from 'vue'
import App from './App.vue'

const history = createHashHistory()

const app = createApp(App).use(VueRouterDom, history)

app.mount('#app')
```

### Components

#### Route

##### [render: func](https://reactrouter.com/web/api/Route/render-func)

There is no `render prop`.

[Route props](https://reactrouter.com/web/api/Route/route-props)
are passed through the `default slot`.

```html
<!-- App.vue -->
<template>
  <Route path="/user/:userId" v-slot="{ match }">
    <User :url="match.url" :userId="match.props.userId" />
  </Route>
</template>
```

wrapping/composing

```html
<!-- FadingRoute.vue -->
<template>
  <Route v-slot="routeProps">
    <FadeIn>
      <slot v-bind="routeProps" />
    </FadeIn>
  </Route>
</template>

<!-- App.vue -->
<template>
  <FadingRoute path="/cool" v-slot="routeProps">
    <Something v-bind="routeProps" />
  </FadingRoute>
</template>
```

##### [children: func](https://reactrouter.com/web/api/Route/children-func)

There is no `children prop`.

[Route props](https://reactrouter.com/web/api/Route/route-props)
are passed through `children slot`.

```html
<!-- ListItemLink.vue -->
<template>
  <Route :path="to" #children="{ match }">
    <li :class="match ? 'active' : ''">
      <link :to="to" />
    </li>
  </Route>
</template>

<script>
  export default {
    props: ['to'],
  }
</script>

<!-- App.vue -->
<template>
  <ul>
    <ListItemLink to="/somewhere" />
    <ListItemLink to="/somewhere-else" />
  </ul>
</template>
```

#### WithRouter

[withRouter](https://reactrouter.com/web/api/withRouter) higher-order component is replaced by `WithRouter`. `WithRouter` provides props throught `default slot`.

```html
<!-- ShowTheLocation.vue -->
<template>
  <div>
    You are now at {location.pathname}
  </div>
</template>

<script>
  export default {
    props: ['match', 'location', 'history'],
  }
</script>

<!-- ShowTheLocationWithRouter.vue -->
<template>
  <WithRouter v-slot="{ match, location, history }">
    <ShowTheLocation :match="match" :location="location" :history="history" />
  </WithRouter>
</template>
```

#### Prompt

is not implemented

#### Routers

`MemoryRouter`, `StaticRouter`, `HashRouter`, `BrowserRouter` are not implemented because history is provided on the install
