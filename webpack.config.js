const Html = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const Copy = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        popup: path.resolve(__dirname, 'popup/popup.jsx'),
        background: path.resolve(__dirname, 'background/background.js'),
        content: path.resolve(__dirname, 'content/content.jsx')
    },
    output: {
        path: path.join(__dirname, 'translatePlugin'),
        filename: 'js/[name].js',
        chunkFilename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
                    { loader: 'css-loader', options: { modules: true } },
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
                    { loader: 'css-loader', options: { modules: true } },
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name].[hash:8].[ext]',
                        limit: 8192,
                        outputPath: 'imgs/',
                        publicPath: '../imgs'
                    }
                }
            }
        ]
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
        // splitChunks: {
        //     chunks: 'all',
        //     minSize: 3000,
        //     minChunks: 1,
        //     maxAsyncRequests: 5,
        //     maxInitialRequests: 3,
        //     cacheGroups: {
        //         vendors: {
        //             test: /[\\/]node_modules[\\/]/,
        //             priority: 1,
        //             filename: 'vendors.js',
        //         }
        //     }
        // },
    },
    devtool: false,
    performance: {
        hints: false
    },
    plugins: [
        new Html({
            filename: 'popup.html',
            template: 'popup/popup.html',
            chunks: ['popup'],
            hash: false,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true,
            },
        }),
        // new MiniCssExtractPlugin({
        //     filename: 'css/[name].css',
        //     chunkFilename: 'css/[name].css'
        // }),
        new Copy({
            patterns: [
                { from: path.join(__dirname, 'manifest.json'), to: path.join(__dirname, 'translatePlugin/') },
                { from: path.join(__dirname, 'logo'), to: path.join(__dirname, 'translatePlugin/logo') }
            ]
        }),
        new CleanWebpackPlugin(),
    ]
}