process.env.VUE_APP_SERVER_URL = "https://unblog.io:8443";
module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /.html$/,
                    loader: "vue-template-loader",
                    exclude: /index.html/
                }
            ]
        }
    },
    devServer: {
        disableHostCheck: true
    }
}
