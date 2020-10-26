/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js'
    },
    devServer: {
        contentBase: path.join(__dirname, '/dist'),
        hot: true,
        compress: true,
    },
    mode: 'production',   
    devtool: 'source-map',
    experiments: {
        asyncWebAssembly: true,
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: 'ts-loader',
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'old'),
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },            
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',   
        },
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CompressionPlugin({
            algorithm: 'gzip',
            filename: '[path].gz[query]',
            test: /\.(css|html|js|svg|ttf)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        new CompressionPlugin({
            algorithm: 'brotliCompress',
            compressionOptions: {
                level: 11,
            },
            filename: '[path].br[query]',
            test: /\.(css|html|js|svg|ttf)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
};
