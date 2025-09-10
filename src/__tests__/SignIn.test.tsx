import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignIn from '@/features/auth/components/SignIn'
import { useLoginMutation } from '@/features/auth/services/authApi'
import { setToken } from '@/store/slice/authSlice'
import { Provider, useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slice/authSlice'
import { authApi } from '@/features/auth/services/authApi'
import toast from 'react-hot-toast'
import '@testing-library/jest-dom'
import * as ReactModule from 'react'
global.React = ReactModule

jest.mock('@/shared/api/baseQuery', () => ({
  baseQuery: jest.fn(),
}))

jest.mock('@/features/auth/services/authApi')

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

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

//Mock button Google
jest.mock('@/shared/components/googlebutton/GoogleLoginButton', () => {
  const MockGoogleButton = () => <div data-testid="mock-google-button" />
  MockGoogleButton.displayName = 'MockGoogleLoginButton'
  return {
    __esModule: true,
    default: MockGoogleButton,
  }
})

describe('SignIn Component', () => {
  const mockDispatch = jest.fn()
  const mockLogin = jest.fn()

  const mockStore = configureStore({
    reducer: {
      [authApi.reducerPath]: () => ({}),
      auth: authReducer,
    },
    middleware: (gDM) => gDM(),
  })

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch)
    ;(useLoginMutation as jest.Mock).mockReturnValue([
      mockLogin,
      { isLoading: false },
    ])

    global.fetch = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-type': 'application/json' },
        })
      )
    ) as unknown as jest.MockedFunction<typeof fetch>
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider store={mockStore}>{ui}</Provider>)

  it('soumet le formulaire et affiche un toast de succès', async () => {
    mockLogin.mockReturnValue({
      unwrap: () => Promise.resolve({ token: 'fake-token' }),
    })

    renderWithProvider(<SignIn />)

    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockDispatch).toHaveBeenCalledWith(setToken('fake-token'))
      expect(toast.success)
    })
  })

  it('affiche un toast d’erreur si la mutation échoue', async () => {
    mockLogin.mockReturnValue({
      unwrap: () => Promise.reject(new Error('Invalid credentials')),
    })

    renderWithProvider(<SignIn />)

    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'bad@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpass' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('errorLogin')
    })
  })
})
