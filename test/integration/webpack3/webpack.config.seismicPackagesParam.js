const SeismicBuildWebpackPlugin = require('../../../index');

module.exports = {
    entry: {
        "sample": __dirname + '/src/index2.js'
    },
    output: {
        path: __dirname + '/dist/seismicPackages-param/', // 输出的路径
        filename: 'webpacktest.[name].[chunkhash].js' ,  // 打包后文件
        chunkFilename: '[name].bundle.js',
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
            seismicPackages: ["seismic-toolkit"]
        })
    ]
}
