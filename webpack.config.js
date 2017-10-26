const path = require("path")
const CleanWebpackPlugin = require('clean-webpack-plugin') // Supprime les dossier voulus entre chaque compilation
const HtmlWebpackPlugin = require('html-webpack-plugin') // Genere les fichiers HTML
const UglifyJSPlugin = require('uglifyjs-webpack-plugin') // Minimize le js
const ManifestWebpackPlugin = require('manifest-webpack-plugin') // Genere le fichier Manifest avec tout les fichiers source à implementer avec HtmlWebpackPlugin

const dev = process.env.NODE_ENV === "dev"

module.exports = {
    entry: './src/js/app.js',
    watch: dev,
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: '[name].[chunkhash:16].js'
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
        ]
    },
    plugins: [
        new ManifestWebpackPlugin(path.join('public', 'manifest.json')),
        new CleanWebpackPlugin(['public'], {
            dry: false,
            verbose: true,
            root: path.resolve('./')
        }),
        new HtmlWebpackPlugin({
            title: "Test Webpack :P",
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