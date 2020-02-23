const FileManagerPlugin = require('filemanager-webpack-plugin');

const PUBLICPATH='/data/chartcurve';
const WinCC_PROJ_DIR = `D:/temp/W316`;

module.exports = {
    publicPath: `${PUBLICPATH}`,
    productionSourceMap: false, // 不生成用于调试的sourcemap文件
    css: {
        sourceMap: false, // 不生成用于调试的sourcemap文件
        extract: false // 不生成单独的css文件
    },
    devServer: {
        open: true // 自动打开默认浏览器
    },

    configureWebpack: {
        plugins: [
            new FileManagerPlugin({
                onStart: {
                    delete: [
                        `${WinCC_PROJ_DIR}${PUBLICPATH}/*.html`,
                        `${WinCC_PROJ_DIR}${PUBLICPATH}/js`
                    ]
                },
                onEnd: {
                    copy: [
                        {source: './dist/', destination: `${WinCC_PROJ_DIR}${PUBLICPATH}`}
                    ]
                }
            })
        ],
        performance: {
            hints: 'warning',
            //入口起点的最大体积
            maxEntrypointSize: 50000000,
            //生成文件的最大体积
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    }
}