// vue.config.cjs

module.exports = {
  outputDir: "C:/nginx-1.27.4/nginx-1.27.4/html",
  assetsDir: "static",
  publicPath: "/",

  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all'
  }
};
