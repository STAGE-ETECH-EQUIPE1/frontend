import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider, useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { setToken } from '@/store/slice/slice'
import authReducer from '@/store/slice/authSlice'
import SignUp from '@/features/auth/components/SignUp'
import { useSignupMutation } from '@/features/auth/services/authApi'
import { authApi } from '@/features/auth/services/authApi'
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
jest.mock('@/shared/api/baseQuery', () => ({
  baseQuery: jest.fn(() => (args: unknown) => Promise.resolve({ data: args })),
}))

// Mocks
jest.mock('@/features/auth/services/authApi.ts', () => {
  const originalModule = jest.requireActual(
    '@/features/auth/services/authApi.ts'
  )
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
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock GoogleLoginButton
jest.mock('@/shared/components/googlebutton/GoogleLoginButton.tsx', () => ({
  __esModule: true,
  default: () =>
    React.createElement('div', { 'data-testid': 'mock-google-button' }),
}))

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
    await waitFor(() => {
      expect(screen.getByLabelText('fullName')).toBeInTheDocument()
    })

    fireEvent.change(await screen.findByLabelText('fullName'), {
      target: { value: 'John Doe' },
    })
    fireEvent.change(screen.getByLabelText('username'), {
      target: { value: 'johndoe' },
    })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

     // Step 3
    await waitFor(() => {
      expect(screen.getByLabelText('companyName')).toBeInTheDocument()
    })

    fireEvent.change(await screen.findByLabelText('companyName'), {
      target: { value: 'OrbixUp' },
    })
    fireEvent.change(screen.getByLabelText('companyArea'), {
      target: { value: 'industrie' },
    })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))


    // Step 4
    await waitFor(() => {
      expect(screen.getByLabelText('password')).toBeInTheDocument()
    })
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
        companyName: 'OrbixUp',
        companyArea: 'industrie',
        password: '12345678',
        confirmPassword: '12345678',
      })

      expect(mockDispatch).toHaveBeenCalledWith(setToken('fake-token'))
      expect(toast.success)
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

    await waitFor(() => {
      expect(screen.getByLabelText('fullName')).toBeInTheDocument()
    })

    fireEvent.change(await screen.findByLabelText('fullName'), {
      target: { value: 'Bad User' },
    })
    fireEvent.change(screen.getByLabelText('username'), {
      target: { value: 'baduser' },
    })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByLabelText('companyName')).toBeInTheDocument()
    })

    fireEvent.change(await screen.findByLabelText('companyName'), {
      target: { value: 'Bad User' },
    })
    fireEvent.change(screen.getByLabelText('companyArea'), {
      target: { value: 'baduser' },
    })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(screen.getByLabelText('password')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('password'), {
      target: { value: '12345678' },
    })
    fireEvent.change(screen.getByLabelText('confirmPassword'), {
      target: { value: '12345678' },
    })

    fireEvent.click(screen.getByLabelText(/acceptTerms/i))

    fireEvent.click(screen.getByRole('button', { name: /createAccount/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('errorSignup')
    })
  })
})
