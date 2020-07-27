const { src, dest, task, series } = require('gulp')
const filter = require('gulp-filter')
const babel = require('gulp-babel')
const jeditor = require('gulp-json-editor')
const rimraf = require('gulp-rimraf')
const shell = require('gulp-shell')
const tsc = require('gulp-typescript')
const transform = require('gulp-transform')
const env = require('gulp-env')
const tsconfig = require('./tsconfig.json')
const babelConfig = require('./babel.config')

const path = require('path')

const envs = env.set({
    NODE_ENV: 'production'
})

task(
    'release',
    shell.task(
        `standard-version --no-verify && gulp build && npm publish ${tsconfig.compilerOptions.outDir} && (git push --follow-tags origin master || true)`
    )
)

task('clean', () =>
    src([tsconfig.compilerOptions.outDir], {
        read: false,
        allowEmpty: true
    }).pipe(rimraf())
)

task('copy:package', () => {
    const deps = [
        '@material-ui',
        '@lingui',
        'lodash',
        'formik',
        'react',
        'react-dom',
        '@loadable',
        'clsx',
        'yup',
        'material-ui',
        'multimatch',
        'react-color',
        'use-debounce'
    ]
    return src('./package.json')
        .pipe(
            jeditor((json) => {
                const packages = Object.keys(json.dependencies || {}).filter((k) =>
                    deps.some((d) => k.startsWith(d))
                )
                if (packages.length) {
                    json.peerDependencies = json.peerDependencies || {}
                    packages.forEach((p) => {
                        delete json.dependencies[p]
                        json.peerDependencies[p] = '*'
                    })
                }
                delete json.private
                delete json.devDependencies
                delete json.scripts
                delete json.husky
                return json
            })
        )
        .pipe(dest(tsconfig.compilerOptions.outDir))
})

task('dts', () => {
    return src(['./src/lib/**/*'])
        .pipe(envs)
        .pipe(
            filter([
                '**/*.ts',
                '**/*.tsx',
                '**/*.js',
                '**/*.jsx',
                '!**/stories/**',
                '!**/stories',
                '!**/setupTests.*',
                '!**/react-app-env.*'
            ])
        )
        .pipe(tsc({ ...tsconfig.compilerOptions, noEmit: false, isolatedModules: false }))
        .dts.pipe(dest(tsconfig.compilerOptions.outDir))
})

task(
    'build',
    series('clean', 'copy:package', 'dts', () =>
        src(['./src/lib/**/*'])
            .pipe(
                filter([
                    '**',
                    '!**/stories/**',
                    '!**/stories',
                    '!**/setupTests.*',
                    '!**/react-app-env.*'
                ])
            )
            .pipe(babel(babelConfig))
            .pipe(
                transform('utf8', (content, file) => {
                    switch (path.extname(file.path)) {
                        case '.js':
                            const find = 'Trans, {'
                            const re = new RegExp(find, 'g')
                            content = content.replace(re, 'Trans, /*i18n*/ {')
                            return content
                        default:
                            return content
                    }
                })
            )
            .pipe(dest(tsconfig.compilerOptions.outDir))
    )
)
