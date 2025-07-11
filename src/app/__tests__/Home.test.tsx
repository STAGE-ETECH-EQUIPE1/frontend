import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home page', () => {
  it('renders Hello world heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: 'Hello world Test' })
    expect(heading).toBeInTheDocument()
  })
})
