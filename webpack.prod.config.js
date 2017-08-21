var path = require('path');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var config = {
    entry: {
        'ui-core': './js/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'ui-core-[chunkhash].js',
        libraryTarget: 'umd',
        library: ['manywho', 'core'],
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [
        new UglifyJSPlugin({
            minimize: true,
            sourceMap: true,
            include: /\.min\.js$/,
        })
    ],
    module: {
        loaders: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true,
                    fix: true
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
                query: {
                    declaration: false,
                }
            }
        ]
    },
    externals: {
        'react': 'React',
        'react-dom' : 'ReactDOM',
        'jquery': 'jQuery'
    }
}

module.exports = config;