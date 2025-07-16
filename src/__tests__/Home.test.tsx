import { render, screen } from '@testing-library/react'
import HomePage from '@/app/[locale]/page'

describe('Home page', () => {
  it('renders Hello world heading', () => {
    render(<HomePage />)
    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
  })
})
