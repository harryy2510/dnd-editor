const {
    override,
    addWebpackPlugin,
    addBabelPlugin,
    addBabelPlugins,
    disableEsLint,
    addWebpackModuleRule
} = require('customize-cra')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const { paths: rewiredPaths } = require('react-app-rewired')
const { scriptVersion } = rewiredPaths
const paths = require(`${scriptVersion}/config/paths`)
const babelConfig = require('./babel.config')

const isDevelopment = process.env.NODE_ENV !== 'production'

const { styles } = require('@ckeditor/ckeditor5-dev-utils')

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
    addBabelPlugins(...babelConfig.plugins),

    // Disable EsLint
    disableEsLint(),
    // React Refresh
    isDevelopment && addBabelPlugin('react-refresh/babel'),
    isDevelopment && addWebpackPlugin(new ReactRefreshWebpackPlugin()),

    // Adding progressbar plugin
    isDevelopment && addWebpackPlugin(new SimpleProgressWebpackPlugin({ format: 'compact' })),

    // ckeditor 5 config
    addWebpackModuleRule({
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader']
    }),
    addWebpackModuleRule({
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
        use: [
            {
                loader: 'style-loader',
                options: {
                    singleton: true
                }
            },
            {
                loader: 'postcss-loader',
                options: styles.getPostCssConfig({
                    themeImporter: {
                        themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                    },
                    minify: true
                })
            }
        ]
    })
)
