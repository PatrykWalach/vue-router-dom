import { useComputedCallback } from '../../src/utils/computedCallback'
import { isRef, computed } from 'vue'

describe('useComputedCallback()', () => {
  let testObject: object

  beforeEach(() => {
    testObject = {}
  })
  describe('from Ref', () => {
    it('returns Ref', () => {
      const computedTestObject = useComputedCallback(computed(() => testObject))
      expect(isRef(computedTestObject)).toBeTruthy()
    })
    it('returns Ref with value', () => {
      const computedTestObject = useComputedCallback(computed(() => testObject))
      expect(computedTestObject.value).toStrictEqual(testObject)
    })
  })
  describe('from Function', () => {
    it('returns Ref', () => {
      const computedTestObject = useComputedCallback(() => testObject)
      expect(isRef(computedTestObject)).toBeTruthy()
    })
    it('returns Ref with value', () => {
      const computedTestObject = useComputedCallback(() => testObject)
      expect(computedTestObject.value).toStrictEqual(testObject)
    })
  })
  describe('from value', () => {
    it('returns Ref', () => {
      const computedTestObject = useComputedCallback(testObject)
      expect(isRef(computedTestObject)).toBeTruthy()
    })
    it('returns Ref with value', () => {
      const computedTestObject = useComputedCallback(testObject)
      expect(computedTestObject.value).toStrictEqual(testObject)
    })
  })
})
