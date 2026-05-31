import { render, screen } from '@testing-library/react'
import Nav from './Nav'

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>
  return MockLink
})
jest.mock('../../data', () => ({ allGroups: [] }))

describe('Nav', () => {
  it("renders the site title", () => {
    render(<Nav showMobileMenu={false} onClickMenu={() => {}} />)
    expect(screen.getByText("Shira v'Zimra")).toBeInTheDocument()
  })
})
