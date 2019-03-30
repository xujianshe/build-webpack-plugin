const SeismicBuildWebpackPlugin = require('../../../index');

module.exports = {
    entry: {
        "sample": __dirname + '/src/index1.js'
    },
    output: {
        path: __dirname + '/dist/external-param/', // 输出的路径
        filename: 'webpacktest.[name].[chunkhash].js'  // 打包后文件
        , chunkFilename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new SeismicBuildWebpackPlugin({
            externals: {
                'react': 'React',
                'react-dom': 'ReactDOM'
            }
        })
    ]
}
