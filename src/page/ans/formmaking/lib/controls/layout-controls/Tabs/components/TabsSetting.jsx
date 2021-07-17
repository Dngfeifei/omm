import React, { useMemo } from 'react';
import { Input, Select, Checkbox, Radio, Button } from 'antd';
import { genTabsTab } from '@/page/ans/formmaking/lib/utils/genNewCtrl';
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem.jsx';
import TabSetting from './TabsSetting/TabSetting';

const TabsSetting = ({ control, updateFormModel }) => {
  const { options } = control;
  const defaultClass = useMemo(
    () => (options.customClass ? options.customClass.split(' ') : []),
    [options]
  );

  const updateControl = (params) => {
    const newControl = { ...control, ...params };
    updateFormModel(newControl);
  };

  const updateOptions = (params) => {
    const newOptions = { ...options, ...params };
    updateControl({ options: newOptions });
  };

  const handleAddTab = () => {
    updateControl({ tabs: [...control.tabs, genTabsTab(control.tabs.length)] });
  };

  return (
    <div>
      <FormAttrItem label="字段标识">
        <Input value={control.id} disabled />
      </FormAttrItem>

      <FormAttrItem label="风格类型">
        <Radio.Group
          value={options.type}
          onChange={(e) => {
            updateOptions({ type: e.target.value });
          }}
        >
          <Radio.Button value="">默认</Radio.Button>
          <Radio.Button value="card">选项卡</Radio.Button>
          <Radio.Button value="border-card">卡片化</Radio.Button>
        </Radio.Group>
      </FormAttrItem>

      <FormAttrItem label="选项卡位置">
        <Radio.Group
          value={options.tabPosition}
          onChange={(e) => {
            updateOptions({ tabPosition: e.target.value });
          }}
        >
          <Radio.Button value="top">顶部</Radio.Button>
          <Radio.Button value="left">左侧</Radio.Button>
          <Radio.Button value="right">右侧</Radio.Button>
          <Radio.Button value="bottom">底部</Radio.Button>
        </Radio.Group>
      </FormAttrItem>

      <FormAttrItem label="标签配置项">
        {control.tabs.map((tab) => (
          <div key={tab.name} style={{ marginBottom: 10 }}>
            <TabSetting
              updateControl={updateControl}
              tabs={control.tabs}
              tab={tab}
            />
          </div>
        ))}
        <div>
          <Button type="link" onClick={handleAddTab}>
            添加列
          </Button>
        </div>
      </FormAttrItem>

      <FormAttrItem label="自定义Class">
        <CustomerClassSetting options={options} updateOptions={updateOptions} />
      </FormAttrItem>

      <FormAttrItem label="操作属性">
        <Checkbox
          checked={options.hidden}
          onChange={(e) => updateOptions({ hidden: e.target.checked })}
        >
          隐藏
        </Checkbox>
      </FormAttrItem>
    </div>
  );
};

export default TabsSetting;
