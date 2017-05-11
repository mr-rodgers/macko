const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: "./index.tsx",
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

            // All files with an '.md' extension will be inlined as plain text by 'raw-loader'.
            { test: /\.md$/, use: "raw-loader"}
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Macko",
            template: "index.ejs",
        }),
        new UglifyJSPlugin({})
    ]
};