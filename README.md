# vue-router-dom [![CircleCI](https://circleci.com/gh/PatrykWalach/vue-router-dom.svg?style=svg)](https://circleci.com/gh/PatrykWalach/vue-router-dom) [![codecov](https://codecov.io/gh/PatrykWalach/vue-router-dom/branch/master/graph/badge.svg)](https://codecov.io/gh/PatrykWalach/vue-router-dom) ![](https://img.shields.io/npm/v/vue-router-dom)

`vue-router-dom` is a library for vue 3, providing components and hooks for routing.
It is largely a port of [react-router](https://reacttraining.com/react-router/web/guides/philosophy).

Feel free to suggest any missing features from [react-router](https://reacttraining.com/react-router/web/api) API and additional ones

- [Install](#install)
- [Manual Setup](#Manual-Setup)
- [API](#api)
  - [Default](#default)
  - [Components](#Components)
    - [RouterLink 🗹](#RouterLink)
    - [NavLink 🗷](#NavLink)
    - [RouterRoute 🗹](#RouterRoute)
    - [RouterSwitch 🗹](#RouterSwitch)
    - [Redirect 🗹](#Redirect)
  - [Hooks](#hooks)
    - [useHistory 🗹](#useHistory)
    - [useLocation 🗹](#useLocation)
    - [useParams 🗹](#useParams)
    - [useRouteMatch 🗹](#useRouteMatch)
  - [Functions](#Functions)
    - [matchPath 🗹](#matchPath)
  - [Other](#Other)
    - [history](#history)
    - [match](#match)

## Install

```sh
npm i vue-router-dom vue@3
```

## Manual Setup
Just provide the [`history`](#history) and you are ready to go

```typescript
import { ROUTER_HISTORY, createBrowserHistory } from 'vue-router-dom'
import { createApp } from 'vue'
import App from './App.vue'

const history = createBrowserHistory()

const app = createApp(App).provide(ROUTER_HISTORY, history)

app.mount('#app')
```

## API

### `default`

This optional step registers all the components globally and provides the [`history`](#history)

```typescript
import VueRouterDom, { createBrowserHistory } from 'vue-router-dom'
import { createApp } from 'vue'
import App from './App.vue'

const history = createBrowserHistory()

const app = createApp(App).use(VueRouterDom, history)

app.mount('#app')
```

### Components

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

Displays content if path [matches](#matchPath) current url, provides [match](#match) object through v-slot

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

In the above example, both components will render for path `/user/:userId/settings`, second will also render for `/user/:userId`, and none will render for other paths

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



### Functions

#### matchPath
  Useful links:
  - [react-router](https://reacttraining.com/react-router/web/api/matchPath)

### Other

#### history
  Useful links:
  - [react-router](https://reacttraining.com/react-router/web/api/history)
  - [history](https://github.com/ReactTraining/history/)

#### match
  Useful links:
  - [react-router](https://reacttraining.com/react-router/web/api/match) 