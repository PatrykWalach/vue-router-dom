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
  const mapEntries = Array.isArray(keysOrMap)
    ? keysOrMap.map((key) => [key, key]) as [string, keyof O][]
    : Object.entries(keysOrMap)

  return Object.fromEntries(
    mapEntries.map(([key, value]) => [key, obj[value]]),
  ) as Mutable<
    | Pick<O, K>
    | {
        [K in keyof M]: O[M[K]]
      }
  >
}
