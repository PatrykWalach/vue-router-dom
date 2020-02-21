import { PARAM, useParams } from './useParams'
import { ComputedCallback } from '../types'
import { computed } from 'vue'
import { computedCallback } from '../utils'
import { useLocation } from './useLocation'

export const parsePath = (path: string) =>
  '^' + path.replace(RegExp(PARAM, 'g'), '[^/]+')

export const testPath = (path: string, pathname: string) =>
  RegExp(parsePath(path)).test(pathname)

export const useRouteMatch = (pathValue: ComputedCallback<string>) => {
  const path = computedCallback(pathValue)
  const location = useLocation()

  const parsedPath = computed(() => parsePath(path.value))

  const matchRegExp = computed(() => RegExp(parsedPath.value))
  const exactRegExp = computed(() => RegExp(parsedPath.value + '$'))

  const isMatch = computed(() =>
    matchRegExp.value.test(location.value.pathname),
  )

  const url = computed(() => {
    const result = location.value.pathname.match(parsedPath.value)

    if (result) {
      return result.shift()
    }
    return ''
  })

  const isExact = computed(() =>
    exactRegExp.value.test(location.value.pathname),
  )

  const params = useParams()

  const matched = computed(() => ({
    isExact: isExact.value,
    params: params.value,
    path: path.value,
    url: url.value,
  }))

  return computed(() => (isMatch.value ? matched.value : null))
}
