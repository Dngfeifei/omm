## 创建一个新的组件

比如该组件的名称为: custom-component。最简单的方式，是直接复制`lib/controls/base-controls/Input`文件夹，然后做相应的重命名。

详细说明可以往下看。

### 新增组件配置

在`lib/componentsConfig.js`中添加组件配置代码，添加到`basicComponents`、`advanceComponents`或者`layoutComponents`中都可以，区别只是显示在界面上的位置不同。

配置示例如下：
```text
{
  type: 'custom-component',
  icon: 'icon iconfont icon-input',
  dsId: '',
  tableName: '',
  primaryKey: '',
  foreignKey: '',
}
```

### 新增组件代码

新增组件文件夹
```
cd lib/controls/base-controls
mkdir CustomComponent
```

新增用于设计、预鉴和发布的组件Render组件
```
cd CustomComponent
mkdir components
touch components/CustomComponentRender.jsx
```

修改`components/CustomComponentRender.jsx`，代码可参考InputRender.jsx。
```
const CustomComponentRender = () => {
    // TODO
}
export default CustomComponentRender
```

新增用于右侧属性设置相关的Setting组件
```
touch components/CustomComponentSetting.jsx
```

修改`components/CustomComponentSetting.jsx`，代码可参考InputSetting.jsx。
```
const CustomComponentSetting = () => {
    // TODO
}
export default CustomComponentSetting
```

### 组件代码封装

```
touch CustomComponent/index.js
```

代码如下：
```
import CustomComponentSetting from './components/CustomComponentSetting'
import CustomComponentRender from './components/CustomComponentRender'

export default {
  'custom-component-design': CustomComponentRender,
  'custom-component-setting': CustomComponentSetting,
  'custom-component-render': CustomComponentRender,
}
```
注意`custom-component-design`和`custom-component-render`是共用`CustomComponentRender`组件。

### 引入组件

修改`lib/controls/base-controls/index.js`，引入CustomComponent组件。
```
import CustomComponent from './CustomComponent'

const comps = {
    ...others,
    ...CustomComponent
}
export default comps
```

在设计视图中查看是否已经有了该组件。接下来修改`CustomComponentSetting`和`CustomComponentRender`来实现具体的组件逻辑即可。
