const SeismicBuildWebpackPlugin = require('../../../index');
//const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin');
const MyDynamicCdnWebpackPlugin = require('./lib/app');
const SeismicExternalModulePlugin = require('./lib/seismic-external-module-plugin');
const RuntimePublicPathPlugin = require("webpack-runtime-public-path-plugin")

module.exports = {
    entry: {
        "sample": __dirname + '/src/index.js',
        // "demo": __dirname + '/src/demo.js'
    },
    output: {
        path: __dirname + '/dist/multiple-param', // 输出的路径
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
            externals: { 'react': "React", 'react-dom': "ReactDOM", 'jquery': 'jQuery' },
            seismicPackages: ["seismic-toolkit"]
        })
        //new MyDynamicCdnWebpackPlugin()
        // new SeismicExternalModulePlugin({
        //     externals: { 'react': "React", 'react-dom': "ReactDOM" },
        //     compkgs: ["react", "react-dom"],
        //     seismicpkgs: ["seismic-toolkit"]
        // })
        // new RuntimePublicPathPlugin({
        //     runtimePublicPath: "window.__local_cdn_url__ || window.__cdn_url__"
        // })
    ]
}
