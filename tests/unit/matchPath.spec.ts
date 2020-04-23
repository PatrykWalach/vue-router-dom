import { createVariations } from './utils'
import { matchPath } from '../../src'

describe('matchPath', () => {
  describe(`exact`, () => {
    const path = '/one'
    const pathname = path + '/two'

    it(`does not match`, () => {
      const match = matchPath(pathname, { path, exact: true })
      expect(match).toStrictEqual(null)
    })

    it(`matches`, () => {
      const match = matchPath(pathname, path)
      expect(match).not.toStrictEqual(null)
    })
  })

  describe(`strict`, () => {
    const pathname = '/one'
    const path = pathname + '/'

    it(`does not match`, () => {
      const match = matchPath(pathname, { strict: true, path })
      expect(match).toStrictEqual(null)
    })

    createVariations({
      pathname: () => [path, path + 'one/two'],
    }).forEach(({ pathname }) =>
      it(`matches`, () => {
        const match = matchPath(pathname, { strict: true, path })
        expect(match).not.toStrictEqual(null)
      }),
    )
  })

  describe(`strict and exact`, () => {
    const path = '/one'
    const pathname = path

    it(`matches`, () => {
      const match = matchPath(pathname, { path, strict: true, exact: true })
      expect(match).not.toStrictEqual(null)
    })

    createVariations({
      pathname: () => [pathname + '/', pathname + '/two'],
    }).forEach(({ pathname }) =>
      it(`does not match`, () => {
        const match = matchPath(pathname, { path, strict: true, exact: true })
        expect(match).toStrictEqual(null)
      }),
    )
  })

  describe(`sensitive`, () => {
    const pathname = '/one'

    it(`matches`, () => {
      const path = pathname
      const match = matchPath(pathname, { path, sensitive: true })
      expect(match).not.toStrictEqual(null)
    })

    it(`matches`, () => {
      const path = '/One'
      const match = matchPath(pathname, { path, sensitive: true })
      expect(match).toStrictEqual(null)
    })

    it(`does not match`, () => {
      const path = '/One'
      const match = matchPath(pathname, path)
      expect(match).not.toStrictEqual(null)
    })
  })

  it(`returns params`, () => {
    const userId = '12'
    const postId = '14'

    const POST = (userId = ':userId', postId = ':userId') =>
      `/${userId}/${postId}`

    const match = matchPath<{
      userId: string
      postId: string
    }>(POST(userId, postId), { exact: true, path: POST() })
    expect(match).not.toStrictEqual(null)
    expect(match && match.params.userId).toStrictEqual(userId)
    expect(match && match.params.postId).toStrictEqual(postId)
  })
})
