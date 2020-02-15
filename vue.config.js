module.exports = {
    publicPath: '/data/vuecharts',
    productionSourceMap: false, // 不生成用于调试的sourcemap文件
    css: {
        sourceMap: false, // 不生成用于调试的sourcemap文件
        extract: false // 不生成单独的css文件
    },
    devServer: {
        open: true // 自动打开默认浏览器
    }
}