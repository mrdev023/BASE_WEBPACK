const path = require("path")
const CleanWebpackPlugin = require('clean-webpack-plugin') // Supprime les dossier voulus entre chaque compilation
const HtmlWebpackPlugin = require('html-webpack-plugin') // Genere les fichiers HTML
const UglifyJSPlugin = require('uglifyjs-webpack-plugin') // Minimize le js
const ManifestWebpackPlugin = require('webpack-manifest-plugin') // Genere le fichier Manifest avec tout les fichiers source à implementer avec HtmlWebpackPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const dev = process.env.NODE_ENV === "dev"

let cssLoaders = [
    {loader:'css-loader',options:{importLoaders:1,minimize: !dev}},
    {
        loader:'postcss-loader',
        options: {
          plugins: (loader) => [
            require('autoprefixer')({
                browsers: ['last 2 versions', 'ie > 8']
            }),
          ]
        }
    }
] 

module.exports = {
    entry: {
        app : ['./src/css/app.scss','./src/js/app.js']
    },
    watch: dev,
    devtool: dev ? "cheap-module-eval-source-map" : false,
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: '[name].[chunkhash:16].js'
    },
    resolve: {
        alias: {
            '@css': path.resolve('./src/css/'),
            '@': path.resolve('./src/js/')
        }
    },
    devServer: {
        contentBase: path.resolve('./public'),
        overlay: true
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                use: {
                    loader: 'handlebars-loader',
                    options: {
                        helperDirs: [
                            path.resolve(__dirname, 'template/helpers')
                        ],
                        partialDirs: [
                            path.resolve(__dirname, 'template/partials')
                        ]
                    }
                }
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: cssLoaders
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use:[...cssLoaders,"sass-loader"]
                })
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name:'[name].[hash:16].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: !dev
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].[contenthash:16].css'
        }),
        new ManifestWebpackPlugin(),
        new CleanWebpackPlugin(['public'], {
            dry: false,
            verbose: true,
            root: path.resolve('./')
        }),
        new HtmlWebpackPlugin({
            template: 'template/index.hbs',
            //hash: false, // Inutile dans notre cas
            minify:{
                removeComments: !dev,
                collapseWhitespace: !dev,
                conservativeCollapse: !dev
            }
        })
    ]
}

if (!dev) {
    module.exports.plugins.push(new UglifyJSPlugin())
}

// https://github.com/jantimon/favicons-webpack-plugin Pour la generation d'icon pour le crossplatform