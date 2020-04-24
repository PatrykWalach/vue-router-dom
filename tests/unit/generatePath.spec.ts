import { generatePath } from '../../src'

describe('generatePath()', () => {
  const USER = (userId = ':userId') => `/user/${userId}`
  const POST = (postId = ':postId') => `/post/${postId}`

  it('generates path with param', () => {
    const userId = '17'
    const path = generatePath(USER(), { userId })

    expect(path).toStrictEqual(USER(userId))
  })
  it('generates path with params', () => {
    const userId = '17'
    const postId = '12'
    const path = generatePath(USER() + POST(), { userId, postId })

    expect(path).toStrictEqual(USER(userId) + POST(postId))
  })
})
