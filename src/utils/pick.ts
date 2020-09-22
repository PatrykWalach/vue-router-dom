type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

interface Picker {
  <O, K extends keyof O>(obj: O, keys: K[]): Mutable<Pick<O, K>>

  <O, M extends Record<string, keyof O>>(obj: O, keysOrMap: M): Mutable<
    {
      [K in keyof M]: O[M[K]]
    }
  >
}

export const pick: Picker = <
  O,
  K extends keyof O,
  M extends Record<string, keyof O>
>(
  obj: O,
  keysOrMap: K[] | M,
): Mutable<
  | Pick<O, K>
  | {
      [K in keyof M]: O[M[K]]
    }
> => {
  const map = Object.fromEntries(
    Array.isArray(keysOrMap)
      ? keysOrMap.map((key) => [key, key])
      : Object.entries(keysOrMap).map(([key, value]) => [value, key]),
  )

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => key in map)
      .map(([key, value]) => [map[key], value]),
  ) as Mutable<
    | Pick<O, K>
    | {
        [K in keyof M]: O[M[K]]
      }
  >
}
