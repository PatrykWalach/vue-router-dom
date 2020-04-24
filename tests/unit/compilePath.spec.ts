import { compilePath } from '../../src/utils/compilePath'

describe('compilePath()', () => {
  it('returns object', () => {
    const compiledPath = compilePath('/test')

    expect(compiledPath).toBeInstanceOf(Object)
  })

  describe('regexp', () => {
    it('returns regexp', () => {
      const { regexp } = compilePath('/test')
      expect(regexp).toBeInstanceOf(RegExp)
    })

    const REGEXP = (path: string) =>
      new RegExp(`^${path}(?:[\\/#\\?](?=[]|$))?(?=[\\/#\\?]|[]|$)`)
    const STRICT = (path: string) => new RegExp(`^${path}(?=[\\/#\\?]|[]|$)`)
    const END = (path: string) => STRICT_END(`${path}[\\/#\\?]?`)
    const STRICT_END = (path: string) => new RegExp(`^${path}$`)
    const NOT_SENSITIVE = (regexp: RegExp) => new RegExp(regexp, 'i')

    const path = '/test'

    describe('returns correct regexp', () => {
      it('no options', () => {
        const { regexp } = compilePath(path)
        expect(regexp).toStrictEqual(NOT_SENSITIVE(REGEXP(path)))
      })
      it('strict', () => {
        const { regexp } = compilePath(path, { strict: true })
        expect(regexp).toStrictEqual(NOT_SENSITIVE(STRICT(path)))
      })
      it('strict and end', () => {
        const { regexp } = compilePath(path, { strict: true, end: true })
        expect(regexp).toStrictEqual(NOT_SENSITIVE(STRICT_END(path)))
      })
      it('end', () => {
        const { regexp } = compilePath(path, { end: true })
        expect(regexp).toStrictEqual(NOT_SENSITIVE(END(path)))
      })
      it('sensitive', () => {
        const { regexp } = compilePath(path, { sensitive: true })
        expect(regexp).toStrictEqual(REGEXP(path))
      })
    })
  })
  describe('keys', () => {
    it('returns keys', () => {
      const { keys } = compilePath('/test')
      expect(keys).toBeInstanceOf(Array)
    })
  })
})
