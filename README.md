# vue-router-dom

- [Install](#install)
- [API](#api)
  - [Default](#default)
  - [Components](#Components)
    - [BrowserRouter](#BrowserRouter)
    - [RouterLink](#RouterLink)
    - [RouterRoute](#RouterRoute)
    - [RouterSwitch](#RouterSwitch)
  - [Hooks](#hooks)
    - [useHistory](#useHistory)
    - [useLocation](#useLocation)
    - [useParams](#useParams)
    - [useRouteMatch](#useRouteMatch)

## Install

```sh
npm i vue-router-dom vue@3
```

## API

### `default`

This optional step registers all the components globally

```typescript
import VueRouterDom from 'vue-router-dom'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(VueRouterDom)

app.mount('#app')
```

### Components

#### BrowserRouter

Place it at the root of the App

```html
<!-- App.vue -->
<template>
  <BrowserRouter>
    <TheHeader />
    <TheMain />
    <TheFooter />
  </BrowserRouter>
</template>
```

#### RouterLink

```html
<!-- TheHeader.vue -->
<template>
  <header>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink :to="`/user/${userId}`">Profile</RouterLink>
  </header>
</template>
```

#### RouterRoute

Displays content if path matches current url

```html
<!-- TheFooter.vue -->
<template>
  <footer>
    <RouterRoute path="/user/:userId/settings" v-slot="{ params }">
      <UserFooter :userId="params.userId" />
    </RouterRoute>

    <RouterRoute path="/user/:userId" v-slot="{ params }">
      <UserFooter :userId="params.userId" />
    </RouterRoute>
  </footer>
</template>
```

In the above example both components will render for path `/user/:userId/settings`, second will also render for `/user/:userId`, and none will render for other paths

Route nesting

```html
<!-- TheMain.vue -->
<template>
  <!-- ... -->
  <RouterRoute path="/user/:userId" v-slot="{ params, url }">
    <ViewUser :userId="params.userId" :url="url" />
  </RouterRoute>
  <!-- ... -->
</template>
```

```html
<!-- ViewUser.vue -->
<template>
  <RouterRoute :path="url + '/about'">
    <UserViewAbout :userId="userId" />
  </RouterRoute>
  <RouterRoute :path="url + '/follows'">
    <UserViewFeed :userId="userId" />
  </RouterRoute>
</template>
```

#### RouterSwitch

Displays first route which matched current url

It's important to place more specific route first: `/user/user1` first, then `/user/:userId`, then `/home`, then `/:path`, then `/`

```html
<!-- TheMain.vue -->
<template>
  <main>
    <RouterSwitch>
      <RouterRoute path="/user/:userId" v-slot="{ params }">
        <ViewUser :userId="params.userId" />
      </RouterRoute>
      <RouterRoute path="/settings">
        <ViewSettings />
      </RouterRoute>
      <RouterRoute path="/">
        <ViewHome />
      </RouterRoute>
    </RouterSwitch>
  </main>
</template>
```

### Hooks
