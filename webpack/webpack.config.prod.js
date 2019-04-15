/**
 * Webpack config for production builds
 */

import CleanWebpackPlugin from 'clean-webpack-plugin'

import mainConfig from './prod/main.config'
import preloadConfig from './prod/preload.config'
import rendererConfig from './prod/renderer.config'

mainConfig.plugins.unshift(
  new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!config.json'] })
)

export default [mainConfig, preloadConfig, rendererConfig]
