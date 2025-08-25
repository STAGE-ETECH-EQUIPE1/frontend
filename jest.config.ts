// jest.config.ts
import type { Config } from 'jest'
import { pathsToModuleNameMapper } from 'ts-jest'
import fs from 'fs'

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf-8'))
const compilerOptions = tsconfig.compilerOptions
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-leaflet|@react-hook|@hookform|next-intl|react-hot-toast)/)',
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

export default config
