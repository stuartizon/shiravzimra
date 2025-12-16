/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      source: '/scores/:score.pdf',
      headers: [
        {
          key: 'Content-Disposition',
          value: 'inline'
        }
      ]
    }
  ],
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig
