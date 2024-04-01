module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        // Optionally, you can specify a port and pathname prefix
        // port: '443', // 443 is the default for https and can be omitted
        // pathname: '/v0/b/tripify-93d9a.appspot.com/o/images/*',
      },
    ],
  },
  reactStrictMode: false,
  images: {
    domains: ['maps.googleapis.com'],
  }
}
