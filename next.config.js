module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    typescript: {
      ignoreBuildErrors: true
    },
    eslint: {
      ignoreDuringBuilds: true
    },

    webpack: (config, options) => {
      config.module.rules.push(
        {
          test: /\.svg$/,
          issuer: /\.(tsx|ts)$/,
          use: [{ loader: '@svgr/webpack', options: { icon: true } }]
        },
        {
          test: /\.gif$/,
          type: 'asset/resource'
        }
      )

      config.plugins.push(
        new options.webpack.IgnorePlugin({
          resourceRegExp: /^electron$/
        })
      )

      const fallback = config.resolve.fallback || {}

      Object.assign(fallback, {
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        fs: false,
        crypto: false,
        os: false,
        stream: false,
        assert: false,
        tls: false,
        net: false
      })

      config.resolve.fallback = fallback

      config.plugins = (config.plugins || []).concat([
        new options.webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      ])

      return typeof defaultConfig.webpack === 'function'
        ? defaultConfig.webpack(config, options)
        : config
    },

    async redirects() {
      return [
        {
          source: '/publish',
          destination: '/publish/1',
          permanent: true
        }
      ]
    }

    // experimental: { esmExternals: true }
  }

  return nextConfig
}
