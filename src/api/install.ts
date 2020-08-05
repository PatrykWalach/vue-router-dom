import * as components from '../components/index'

import { App } from 'vue'

export const install = (app: App) => {
  for (const key in components) {
    app.component(key, components[key as keyof typeof components])
  }
}
