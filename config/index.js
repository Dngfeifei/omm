// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var merge = require('webpack-merge')
var buildconfig = {
  env: require('./prod.env'),
  index: path.resolve(__dirname, '../dist/index.html'),
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
  productionGzip: true,
  productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report
}


//var target = {target: 'http://www.xiaochuioa.com/xpro'}

//var target = {target: 'http://192.168.1.123:8090'}
var target = {target: 'http://10.0.16.120:8090'}

// var file_target = {target: 'http://39.105.123.72:8340'}
var file_target = {target: 'http://140.143.131.186:80'}


// 后端shh本地地址
var apiTarget = {target:'http://10.0.16.205:8090'}

// 后端ces本地地址
var apiTargetC =  {target: 'http://10.0.16.120:8111'}





module.exports = {
  build: buildconfig,
  dev: {
    env: require('./dev.env'),
    port: 8881,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/menu': target,
      '/notice': target,
      '/dict': target,
      '/sysResources': target,
      '/sysDicts':target,

      '/auth': apiTarget,// shh本地登录接口
      '/paramCategories':apiTarget,  // 系统参数--左侧节点树所有接口
      '/sysParam':apiTarget,  // 系统参数--右侧表格所有接口

      '/securityRoleCategories':apiTarget,
      '/sysLog':apiTarget,
      '/sysDictItems':apiTargetC,  // 操作日志--操作类型
      
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
