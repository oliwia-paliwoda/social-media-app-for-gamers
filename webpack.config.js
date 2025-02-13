const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'file-loader',
                exclude:  /node_modules\/flag-icons\/flags/,
                options: {
                    name: 'images/[name].[ext]',
                    publicPath: '/'
                }
            },
            {
                test: /\.svg$/i,
                include: /node_modules\/flag-icons\/flags/,
                loader: 'file-loader',
                options:
                    {
                        name: 'flags/4x3/[name].[ext]',
                        publicPath: '/',
                    },
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'vue$': 'vue/dist/vue.esm.js',
        },
        extensions: ['*', '.js', '.vue', '.json'],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
        open: true,
        hot: true,
        watchContentBase: true,
        historyApiFallback: true,
    }
};
