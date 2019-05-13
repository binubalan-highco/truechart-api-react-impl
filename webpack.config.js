const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.ts'
    },
    resolve:{
        extensions: ['.ts', '.tsx', '.html', '.js', '.json']
    },
    output:{
        path: path.resolve(__dirname + '/dist'),
        filename: "app.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./html/index.html"
        })
    ],
    module: {
        rules:  [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            }, {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'html-loader'
            }, {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'file-loader'
            }, {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader'
            }, {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
        ]
    },

    //Enable sourcemaps for debugging webpack's output
    devtool: "source-map",
};