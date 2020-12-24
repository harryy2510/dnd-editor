const libs = [
    'lodash-es',
    '@material-ui/core',
    '@material-ui/styles',
    '@material-ui/icons',
    '@material-ui/lab'
]

module.exports = {
    plugins: libs.map((l) => [
        'import',
        { libraryName: l, libraryDirectory: '', camel2DashComponentName: false },
        l
    ])
}
