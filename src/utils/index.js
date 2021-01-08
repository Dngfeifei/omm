const requireComponent = require.context(
  "@/page/componentsHome", //组件所在目录的相对路径
  true, //是否查询其子目录
  /\w+\.jsx$/ //匹配基础组件文件名的正则表达式
);
export const comObj = {};
requireComponent.keys().forEach(fileName => {
  // 获取文件名
  var names = fileName
    .split("/")
    .pop()
    .replace(/\.\w+$/, "");
  // 获取组件配置
  const componentConfig = requireComponent(fileName);
  // 若该组件是通过"export default"导出的，优先使用".default"，否则退回到使用模块的根
  comObj[names] = componentConfig.default || componentConfig;
});