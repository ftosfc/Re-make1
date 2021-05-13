module.exports = {
    devServer: {
        proxy: {
            port: 8080,

            host: "localhost",

            https: false,

            // 自动启动浏览器

            open: false,
            //名字可以自定义，这里我用的是api，注意原请求地址中不能出现这个名字
            '/api': {
                target: 'http://192.168.1.35:16666/',//后台接口，请求的目标地址的BaseURL
                changeOrigin: true,//是否开启跨域
                ws:true,
                pathRewrite: {
                    '^/api': ''//规定请求地址以什么作为开头
                }
            }
        }
    }
}
