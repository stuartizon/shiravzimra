import { readFileSync } from 'fs'
import path from 'path'

it('does not load fonts from the Google Fonts CDN', () => {
  const css = readFileSync(path.join(process.cwd(), 'styles/globals.css'), 'utf8')
  expect(css).not.toContain('fonts.googleapis.com')
})
