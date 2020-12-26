const { override, addWebpackPlugin, addBabelPlugins, disableEsLint } = require('customize-cra')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const babelConfig = require('./babel.config')

const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = override(
    // Babel import optimize
    addBabelPlugins(...babelConfig.plugins),

    // Disable EsLint
    disableEsLint(),

    // Adding progressbar plugin
    isDevelopment && addWebpackPlugin(new SimpleProgressWebpackPlugin({ format: 'compact' }))
)
