import { render, screen } from '@testing-library/react'
import Home from '../app/page'

describe('Home page', () => {
  it('renders Hello world heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: 'Hello world All' })
    expect(heading).toBeInTheDocument()
  })
})
