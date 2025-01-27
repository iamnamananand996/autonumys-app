// tests/global.d.ts
import "@testing-library/jest-dom";

declare global {
  // Extend Vitest's `expect` with matchers from `@testing-library/jest-dom`
  namespace Vi {
    interface Assertion<T = any> extends jest.Matchers<T> {}
    interface AsymmetricMatchers extends jest.AsymmetricMatchers {}
  }
}
