import { render, screen } from '@testing-library/react'
import Nav from './Nav'

jest.mock('next/link', () => ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>)
jest.mock('../../data', () => ({ allGroups: [] }))

describe('Nav', () => {
  it("renders the site title", () => {
    render(<Nav showMobileMenu={false} onClickMenu={() => {}} />)
    expect(screen.getByText("Shira v'Zimra")).toBeInTheDocument()
  })
})
