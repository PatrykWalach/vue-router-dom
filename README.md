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

### Hooks
