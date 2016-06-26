var cssnext = require('postcss-cssnext'),
    clearfix = require('postcss-clearfix'),
    fontMagician = require('postcss-font-magician'),
    normalize = require('postcss-normalize'),
    postcssImport = require('postcss-import'),
    precss = require('precss');

module.exports = {
    entry: {
        main: './src/index',
        frame: './src/frame'
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: 'node_modules/',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules!postcss-loader'
            }
        ]
    },
    postcss: function() {
        return [
            postcssImport,
            normalize,
            precss,
            cssnext,
            fontMagician,
            clearfix
        ];
    }
}