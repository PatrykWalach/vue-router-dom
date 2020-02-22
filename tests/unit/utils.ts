import { App, Component, createApp } from 'vue'

type Chunk<K extends string, T> = {
  [key in K]: T
}

type Fn<A> = () => A

type MakeVariations<T> = {
  [K in keyof T]: T[K] extends Fn<infer R>
    ? R extends (infer U)[]
      ? U
      : T[K]
    : MakeVariations<T[K]>
}

export const mount = (
  AppComponent: Component,
  isntall: (app: App) => App = app => app,
) => isntall(createApp(AppComponent)).mount(document.createElement('template'))

const keyAndArrayToChunks = <K extends string, A>(key: K, permutations: A[]) =>
  permutations.map(value => ({
    [key]: value,
  })) as Chunk<K, A>[]

const reduceChunksMap = <O extends Chunk<any, any>>(
  chunksMap: O[][],
  i: number,
) => {
  let product = 1

  return chunksMap.reduce((acc, chunks) => {
    const chunksLength = chunks.length
    const chunk = chunks[Math.floor(i / product) % chunksLength]
    product *= chunksLength

    return {
      ...acc,
      ...chunk,
    }
  }, {})
}
const createArrayOfLength = (length: number) =>
  Array.from({ length }, (v, k) => k)

const createChunksMap = <O extends Record<string, any>>(obj: O) => {
  const chunksMap: Chunk<string, any>[][] = []

  Object.entries(obj).forEach(([key, value]) => {
    if (value instanceof Function) {
      return chunksMap.push(keyAndArrayToChunks(key, value()))
    }
    if (value instanceof Object) {
      return chunksMap.push(keyAndArrayToChunks(key, createVariations(value)))
    }
  })

  return chunksMap
}

export const createVariations = <O extends Chunk<any, any>>(
  obj: O,
): MakeVariations<O>[] => {
  const chunksMap = createChunksMap(obj)

  const permutations = chunksMap.reduce((acc, chunk) => acc * chunk.length, 1)

  return createArrayOfLength(permutations).map(i => ({
    ...obj,
    ...reduceChunksMap(chunksMap, i),
  }))
}

//   }),
