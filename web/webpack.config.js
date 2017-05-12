const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require("webpack");

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
    context: path.resolve(__dirname),

    entry: {
        vendor: [
            "core-js/es6",
            "mobx", 
            "mobx-react",
            "react", 
            "react-dom", 
            "react-router", 
            "react-router-dom", 
            "reactstrap", 
            "whatwg-fetch"
        ],
        app: "./index.tsx",
    },
    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "dist")
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader", options: {configFileName: path.join(__dirname, "tsconfig.json")} },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            // All files with an '.json' extension will be loaded as json.
            { test: /\.json$/, use: "json-loader" },

            // All file with a '.css' extension will be loaded as styles
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract([
                    {
                        loader: "css-loader",
                        options: { minimize: true }
                    },
                    { loader: "sass-loader" }
                ])
            }

        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.

    plugins: [
        new HtmlWebpackPlugin({
            title: "Macko",
            template: "index.ejs",
        }),
        new ExtractTextPlugin('[name].css'),
        new CommonsChunkPlugin({name: "vendor", filename: "vendor.js", minChunks: Infinity}),
        new CopyWebpackPlugin([{from: "docs", to: "docs"}])
    ]
};