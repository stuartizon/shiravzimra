const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const pdfWorkerPath = require.resolve(`pdfjs-dist/build/pdf.worker.min.js`)

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
  swcMinify: true,
  webpack: config => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: pdfWorkerPath,
            to: path.join(__dirname, 'public')
          }
        ]
      })
    )

    return config
  }
}

module.exports = nextConfig
