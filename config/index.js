// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var merge = require('webpack-merge')
var buildconfig = {
  env: require('./prod.env'),
  index: path.resolve(__dirname, '../omsweb/index.html'),
  assetsRoot: path.resolve(__dirname, '../omsweb'), //path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static', //静态资源目录名
  assetsPublicPath: './', //入口文件引用静态资源的路径配置
  productionSourceMap: false, //设置成false 可以加密源码，但是无法准确定位输出错误找到错误位置
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

var target = {
  // target: 'http://localhost:8111',
  target: 'http://172.16.100.81/api/dat',
  headers: {
    Connection: "keep-alive",
    'Cache-Control': 'max-age=0',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
  },
  secure: false,
  logLevel: 'debug'
}
// var target = {target: 'http://10.0.17.214:8111'}
// var target = {target: 'http://localhost:8111'}

module.exports = {
  build: buildconfig,
  dev: {
    env: require('./dev.env'),
    port: 8111,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/menu': target,
      '/notice': target,
      '/dict': target,
      '/auth': target, // shh本地登录接口
      '/paramCategories': target, // 系统参数--左侧节点树所有接口
      '/sysParam': target, // 系统参数--右侧表格所有接口
      '/organization': target, //机构
      '/sysResources': target, //资源
      '/securityRoleCategories': target, //角色组
      '/securityRoles': target, //角色
      '/sysPositions': target, //岗位
      '/sysUser': target, //用户
      '/user': target, //用户
      '/sysDicts': target, //数据字典
      '/sysDictItems': target, //数据字典项
      '/sysLog': target, // 操作日志模块
      '/getCode': target, //获取验证码
      '/updatePass': target, // 首次登录修改密码
      '/logout': target, //退出登录
      '/biUser': target, // 工程师管理模块
      '/biCustomer': target, // 客户信息模块
      '/process': target, // 工作流模块
      '/eng': target, // 工作流模块分支
      '/biComproom': target, // 客户信息模块---机房地址信息·
      '/biProject': target, // 项目信息模块
      '/biCert': target, // 工程师信息---证书模块
      '/biCompany': target, // 工程师信息---公司列表
      '/biProjectArea': target, // 项目信息---服务区域
      '/biProjectMember': target, // 项目信息---项目组成员列表
      '/biCustContact': target, // 项目信息---客户技术联系人列表
      '/biServiceObject': target, // 项目信息---服务对象列表
      '/sqt': target, //服务需求表-工单号
      '/biSqtBase': target, //服务需求表
      '/assessVersion': target, // 工程师自评估配置-评估版本
      '/assessConfig': target, // 工程师自评估配置-配置数据
      '/temporaryOpen': target, // 工程师自评估配置-临时开启
      '/assessProable': target, // 工程师自评估新增专业技能
      '/assess': target, // 工程师自评专业数据查询
      '/basedata': target, // 工程师自评基础数据查询
      '/sql': target, // 工作流认领接口
      '/microRisk': target, // 微观风险接口
      '/microRiskSum': target, // 微观风险汇总接口
      '/biSqtMacroRiskSum': target, // 宏观风险汇总查询
      '/biSqtMacroResourceSum': target, // 宏观风险汇总提交
      '/biSqtMacroRisk': target, // 宏观风险
      '/biStatisticalReport': target, //统计报表
      '/bdpFunAuth': target, // 数据权限流程表单顶级模型树接口
      '/sysPositionsCategories': target, //数据权限岗位组树装列表|查询岗位列表（分页）接口
      '/biConfigurations': target, // 配置库-配置管理联想输入
      '/fileCategories': target, //介质接口
      '/filePonints': target, //币值接口
      '/fileLibrary': target, //介质库列表数据接口
      '/fileLike': target, //介质库文件点赞
      '/fileCollect': target, //介质库文件收藏
      '/fileLevel': target, //介质文件级别数据
      '/fileApply': target, //介质文件下载审核
      '/workPlatform': target, //工作台基础信息

      '/metaCategories': target,     // 元数据分类
      '/metaTable': target,     // 元数据
      '/metaData': target,     // 元数据
      '/flowable': target,     // 流程设计
      '/extension': target,     // 流程设计
      '/sys': target,     // 流程设计
      '/app/': target,     // 流程设计
      '/form/': target,     // 流程设计
      '/sysMessage': target, //系统消息接口
      '/basedataMeta': target, //配置库基础数据获取子节点编码
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
