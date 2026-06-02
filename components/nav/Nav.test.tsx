import { render, screen, fireEvent } from '@testing-library/react'
import Nav from './Nav'

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a>
  return MockLink
})
jest.mock('../../data', () => ({ allGroups: [] }))

describe('Nav', () => {
  it("renders the site title", () => {
    render(<Nav showMobileMenu={false} onClickMenu={() => {}} />)
    expect(screen.getByText("Shira v’Zimra")).toBeInTheDocument()
  })

  it("calls onClickMenu when Escape is pressed and menu is open", () => {
    const onClickMenu = jest.fn()
    render(<Nav showMobileMenu={true} onClickMenu={onClickMenu} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClickMenu).toHaveBeenCalledTimes(1)
  })

  it("does not call onClickMenu when Escape is pressed and menu is closed", () => {
    const onClickMenu = jest.fn()
    render(<Nav showMobileMenu={false} onClickMenu={onClickMenu} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClickMenu).not.toHaveBeenCalled()
  })
})
