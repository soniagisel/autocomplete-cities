import { render, screen } from '@testing-library/react'
import App from './App'

test('renders', () => {
    render(<App />)
    const h1 = screen.getByText(/Welcome to the Code Challenge/i)
    expect(h1).toBeInTheDocument()
})
