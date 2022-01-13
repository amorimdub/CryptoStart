const withTM = require('next-transpile-modules')(['@cryptostar/ui'])

module.exports = withTM({
  reactStrictMode: true,
})
