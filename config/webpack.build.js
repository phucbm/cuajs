const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {paths, server, packageInfo, env} = require('./config');
const path = require("path");

/**
 * Sample variables: "cross-env ENTRY=web"
 * ENTRY: folder to start building the bundle
 */
const entryFolder = env.ENTRY || 'web';
const entryPath = path.resolve(__dirname, `../${entryFolder}`);
const BASE_URL = env.BASE_URL || 'https://cuajs.netlify.app';

module.exports = merge(server, {
    mode: 'production',
    devtool: false,

    // Where webpack looks to start building the bundle
    entry: [entryPath + '/script.js'],

    output: {
        path: paths.build,
        publicPath: '/',
        filename: 'js/[name].[contenthash].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                            modules: false,
                        },
                    },
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        // Extracts CSS into separate files
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
            chunkFilename: '[id].css',
        }),
        // Removes/cleans build folders and unused assets when rebuilding
        new CleanWebpackPlugin(),

        // Copies files from target to destination folder
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.public,
                    to: 'assets',
                    globOptions: {
                        ignore: ['*.DS_Store'],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),

        // Generates an HTML file from a template
        // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            title: `${packageInfo.prettyName} - ${packageInfo.tagline}`,
            favicon: paths.public + '/images/favicon.png',
            template: entryPath + '/index.html', // template file
            filename: 'index.html', // output file
            meta: {
                // Basic metadata
                'description': {
                    name: 'description',
                    content: packageInfo.description
                },
                'keywords': {
                    name: 'keywords',
                    content: packageInfo.keywords.join(', ')
                },
                'author': {
                    name: 'author',
                    content: packageInfo.author.name
                },
                // OpenGraph metadata
                'og:type': {
                    property: 'og:type',
                    content: 'website'
                },
                'og:url': {
                    property: 'og:url',
                    content: BASE_URL
                },
                'og:title': {
                    property: 'og:title',
                    content: `${packageInfo.prettyName} - ${packageInfo.tagline}`
                },
                'og:description': {
                    property: 'og:description',
                    content: packageInfo.description
                },
                'og:image': {
                    property: 'og:image',
                    content: `${BASE_URL}/assets/images/thumbnail.jpg`
                },
                // Twitter metadata
                'twitter:card': {
                    property: 'twitter:card',
                    content: 'summary_large_image'
                },
                'twitter:url': {
                    property: 'twitter:url',
                    content: BASE_URL
                },
                'twitter:title': {
                    property: 'twitter:title',
                    content: `${packageInfo.prettyName} - ${packageInfo.tagline}`
                },
                'twitter:description': {
                    property: 'twitter:description',
                    content: packageInfo.description
                },
                'twitter:image': {
                    property: 'twitter:image',
                    content: `${BASE_URL}/assets/images/thumbnail.jpg`
                },
                // Theme color
                'theme-color': {
                    name: 'theme-color',
                    content: '#f9857a'
                }
            },
            // Add this configuration
            links: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '32x32',
                    href: '/assets/images/favicon.png'
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '16x16',
                    href: '/assets/images/favicon.png'
                },
                {
                    rel: 'apple-touch-icon',
                    sizes: '180x180',
                    href: '/assets/images/favicon.png'
                }
            ]
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), '...'],
        runtimeChunk: {
            name: 'runtime',
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
})
