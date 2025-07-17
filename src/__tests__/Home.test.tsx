import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import HomePage from '@/app/[locale]/page'

describe('HomePage', () => {
  it('renders the Auth component', () => {
    render(<HomePage />)

    // Check if the Auth component is rendered
    const authElement = screen.getByText(/Sign In/i)
    expect(authElement).toBeInTheDocument()
  })

  it('renders the ThemeProvider', () => {
    render(<HomePage />)

    // Check if the ThemeProvider is applied
    const themeElement = screen.getByTestId('theme-provider')
    expect(themeElement).toBeInTheDocument()
  })
})
