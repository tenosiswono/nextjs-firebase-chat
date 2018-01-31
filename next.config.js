const path = require('path')
const glob = require('glob')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'babel-loader', query: {compact: false}
          }, 'raw-loader', 'postcss-loader']
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          {
            loader: 'babel-loader', query: {compact: false}
          }, 'raw-loader', 'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['styles', 'node_modules']
                .map((d) => path.join(__dirname, d))
                .map((g) => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    )
    if (!dev) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'disabled',
          generateStatsFile: true,
          statsFilename: 'stats.json'
        })
      )
    }
    return config
  }
}
