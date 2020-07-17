const {
    override,
    addWebpackPlugin,
    addBabelPlugin,
    addBabelPlugins,
    disableEsLint
} = require('customize-cra')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const { paths: rewiredPaths } = require('react-app-rewired')
const { scriptVersion } = rewiredPaths
const paths = require(`${scriptVersion}/config/paths`)

const libs = [
    'lodash-es',
    '@material-ui/core',
    '@material-ui/styles',
    '@material-ui/icons',
    '@material-ui/lab'
]

const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = override(
    // Custom config override
    (config) => {
        // Disable eslint
        config.module.rules.splice(1, 1)

        // Disable type checking
        paths.appTsConfig = undefined

        // // config.plugins = config.plugins.filter(
        // //     (p) => p.constructor.name !== 'ForkTsCheckerWebpackPlugin'
        // // )

        return config
    },

    // Babel import optimize
    addBabelPlugins(
        ...libs.map((l) => [
            'import',
            { libraryName: l, libraryDirectory: '', camel2DashComponentName: false },
            l
        ])
    ),

    // Disable EsLint
    disableEsLint(),
    // React Refresh
    isDevelopment && addBabelPlugin('react-refresh/babel'),
    isDevelopment && addWebpackPlugin(new ReactRefreshWebpackPlugin()),

    // Adding progressbar plugin
    isDevelopment && addWebpackPlugin(new SimpleProgressWebpackPlugin({ format: 'compact' }))
)
