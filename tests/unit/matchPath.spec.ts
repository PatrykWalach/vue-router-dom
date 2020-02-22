import { createVariations } from './utils'
import { matchPath } from '../../src'

describe('matchPath', () => {
  createVariations({
    path: () => ['/user', '/:param', '', '/'],
    pathname: () => ['/user', '/user/about'],
  }).forEach(({ path, pathname }, i) => {
    it(`matches ${i}`, () => {
      const match = matchPath(pathname, path)
      expect(match).not.toStrictEqual(null)
    })
  })

  createVariations({
    path: () => [
      '/user/home',
      '/:param/home',
      '/settings',
      '/settings/about',
      '/settings/:param',
    ],
    pathname: () => ['/user', '/user/about', '/'],
  }).forEach(({ path, pathname }, i) => {
    it(`does not match ${i}`, () => {
      const match = matchPath(pathname, path)
      expect(match).toStrictEqual(null)
    })
  })

  createVariations({
    path: () => ['/user/about', '/user/:param', '/:param/:param'],
    pathname: '/user/about',
  }).forEach(({ path, pathname }, i) => {
    it(`matches exact ${i}`, () => {
      const match = matchPath(pathname, { exact: true, path })
      expect(match).not.toStrictEqual(null)
      expect(match && match.isExact).toStrictEqual(true)
    })
  })

  createVariations({
    path: () => ['/user', '/:param', '/user/home', '/'],
    pathname: () => ['/user/about'],
  }).forEach(({ path, pathname }, i) => {
    it(`does not match exact ${i}`, () => {
      const match = matchPath(pathname, { exact: true, path })
      expect(match).toStrictEqual(null)
    })
  })

  it(`returns params`, () => {
    const USER_ID = '12'
    const POST_ID = '14'

    const match = matchPath<{
      userId: string
      postId: string
    }>(`/${USER_ID}/${POST_ID}`, { exact: true, path: '/:userId/:postId' })
    expect(match).not.toStrictEqual(null)
    expect(match && match.params.userId).toStrictEqual(USER_ID)
    expect(match && match.params.postId).toStrictEqual(POST_ID)
  })
})
