import '@testing-library/jest-dom'

jest.mock('next-intl', () => {
  const actual = jest.requireActual('next-intl')
  return {
    ...actual,
    unstable_setRequestLocale: jest.fn(),
    getTranslations: jest.fn().mockImplementation(async (namespace: string) => {
      const messages: { [key: string]: string } = (
        await import(`../../messages/${namespace}.json`)
      ).default

      return (key: string) => {
        return messages[key] || key
      }
    }),
  }
})
