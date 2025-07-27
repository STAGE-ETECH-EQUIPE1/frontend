import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider, useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { setToken } from '@/features/authSlice'
import authReducer from '@/features/authSlice'
import SignUp from '@/app/(components)/auth/SignUp'
import { useSignupMutation } from '@/store/api/authApi'
import { authApi } from '@/store/api/authApi'
import toast from 'react-hot-toast'
import '@testing-library/jest-dom'
import type {
  Middleware,
  MiddlewareAPI,
  Dispatch,
  AnyAction,
} from '@reduxjs/toolkit'

// Global mock to avoid fetch warnings
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock

// Mock for fetchBaseQuery
jest.mock('@/store/api/baseQuery', () => ({
  baseQuery: jest.fn(() => (args: unknown) => Promise.resolve({ data: args })),
}))

// Mocks
jest.mock('@/store/api/authApi', () => {
  const originalModule = jest.requireActual('@/store/api/authApi')
  return {
    __esModule: true,
    ...originalModule,
    useSignupMutation: jest.fn(),
    authApi: {
      reducerPath: 'authApi',
      reducer:
        () =>
        (state = {}) =>
          state,
      middleware: ((store: MiddlewareAPI) => {
        void store
        return (next: Dispatch) => (action: AnyAction) => next(action)
      }) as Middleware,
    },
  }
})

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'auth.signup.email': 'email',
      'auth.signup.phone': 'phone',
      'auth.signup.fullName': 'fullName',
      'auth.signup.username': 'username',
      'auth.signup.password': 'password',
      'auth.signup.confirmPassword': 'confirmPassword',
      'auth.signup.acceptTerms': 'acceptTerms',
      'auth.signup.termsOfService': 'termsOfService',
      'auth.signup.and': 'and',
      'auth.signup.privacyPolicy': 'privacyPolicy',
      'auth.signup.next': 'next',
      'auth.signup.back': 'back',
      'auth.signup.createAccount': 'createAccount',
      'auth.signup.or': 'or',
      'toast.successSignup': 'successSignup',
      'toast.errorSignup': 'errorSignup',
      'toast.confirmPassword': 'Passwords do not match',
    }
    return translations[key] || key
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock GoogleLoginButton
jest.mock('@/app/(components)/googlebutton/GoogleLoginButton', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'mock-google-button' }),
}))

jest.mock('@/store/api/authApi', () => {
  const originalModule = jest.requireActual('@/store/api/authApi')
  return {
    __esModule: true,
    ...originalModule,
    useSignupMutation: jest.fn(),
  }
})

describe('SignUp Component', () => {
  const mockDispatch = jest.fn()
  const mockSignup = jest.fn()

  const store = configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: () => ({}),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  })

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch)
    ;(useSignupMutation as jest.Mock).mockReturnValue([
      mockSignup,
      { isLoading: false },
    ])
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider store={store}>{ui}</Provider>)

  it('navigue entre les étapes et soumet le formulaire avec succès', async () => {
    mockSignup.mockReturnValue({
      unwrap: () => Promise.resolve({ token: 'fake-token' }),
    })

    renderWithProvider(<SignUp />)

    // Step 1
    fireEvent.change(screen.getByLabelText('email'), {
      target: { value: 'john@example.com' },
    })
    fireEvent.change(screen.getByLabelText('phone'), {
      target: { value: '+261123456789' },
    })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    // Step 2
    fireEvent.change(screen.getByLabelText('fullName'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('username'), {
      target: { value: 'johndoe' },
    })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    // Step 3
    fireEvent.change(screen.getByLabelText('password'), {
      target: { value: '12345678' },
    })
    fireEvent.change(screen.getByLabelText('confirmPassword'), {
      target: { value: '12345678' },
    })

    // Check the box for the conditions
    fireEvent.click(screen.getByLabelText(/acceptTerms/i))

    fireEvent.click(screen.getByRole('button', { name: /createAccount/i }))

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        email: 'john@example.com',
        phone: '+261123456789',
        fullName: 'John Doe',
        username: 'johndoe',
        password: '12345678',
        confirmPassword: '12345678',
      })
      expect(mockDispatch).toHaveBeenCalledWith(setToken('fake-token'))
      expect(toast.success).toHaveBeenCalledWith('successSignup')
    })
  })

  it('affiche une erreur toast si la mutation échoue', async () => {
    mockSignup.mockReturnValue({
      unwrap: () => Promise.reject(new Error('Signup failed')),
    })

    renderWithProvider(<SignUp />)

    fireEvent.change(screen.getByLabelText('email'), {
      target: { value: 'bad@example.com' },
    })
    fireEvent.change(screen.getByLabelText('phone'), {
      target: { value: '+261000000000' },
    })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    fireEvent.change(screen.getByLabelText('fullName'), {
      target: { value: 'Bad User' },
    })
    fireEvent.change(screen.getByLabelText('username'), {
      target: { value: 'baduser' },
    })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    fireEvent.change(screen.getByLabelText('password'), {
      target: { value: '12345678' },
    })
    fireEvent.change(screen.getByLabelText('confirmPassword'), {
      target: { value: '12345678' },
    })

    fireEvent.click(screen.getByRole('checkbox'))

    fireEvent.click(screen.getByRole('button', { name: /createAccount/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('errorSignup')
    })
  })
})
