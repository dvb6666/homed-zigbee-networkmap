module.exports = {
  publicPath: './',
  css: {
    extract: false
  },
  configureWebpack: {
    entry: {
      'homed-zigbee-networkmap': './src/homed-zigbee-networkmap.js'
    },
    output: {
      filename: '[name].js'
    },
    optimization: {
      splitChunks: false
    }
  },
  productionSourceMap: false
}
