import React, { useCallback, useMemo } from 'react';
import { Input, InputNumber, Switch, Select, Checkbox, Button } from 'antd';
import { genGridColumn } from '@/page/ans/formmaking/lib/utils/genNewCtrl';
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem';
import ColumnSetting from './GridSetting/ColumnSetting';
import CustomerClassSetting from '@/page/ans/formmaking/components/CustomerClassSetting';

const InputSetting = ({ control, updateFormModel }) => {
  const { options } = control;

  const defaultClass = useMemo(
    () => (options.customClass ? options.customClass.split(' ') : []),
    [options]
  );

  const updateControl = useCallback(
    (params) => {
      const newControl = { ...control, ...params };
      updateFormModel(newControl);
    },
    [control]
  );

  const updateOptions = (params) => {
    const newOptions = { ...options, ...params };
    updateControl({ options: newOptions });
  };

  const handleAddCol = () => {
    updateControl({ columns: [...control.columns, genGridColumn()] });
  };

  return (
    <div>
      <FormAttrItem label="字段标识">
        <Input value={control.id} disabled />
      </FormAttrItem>

      <FormAttrItem label="栅格间隔">
        <InputNumber
          min={0}
          max={1000}
          precision={0}
          value={options.gutter}
          onChange={(e) => {
            let n = e || 0;
            if (isNaN(n)) n = 0;
            if (n > 200) n = 200;
            if (n < 0) n = 0;
            updateOptions({ gutter: n });
          }}
        />
      </FormAttrItem>

      <FormAttrItem label="Flex布局">
        <Switch
          checked={options.flex}
          onChange={(checked) => updateOptions({ flex: checked })}
        />
      </FormAttrItem>

      <FormAttrItem label="响应式布局">
        <Switch
          checked={options.responsive}
          onChange={(checked) => updateOptions({ responsive: checked })}
        />
      </FormAttrItem>

      <FormAttrItem label="列配置项">
        {control.columns.map((col) => (
          <div key={col.id} style={{ marginBottom: 10 }}>
            <ColumnSetting
              updateControl={updateControl}
              columns={control.columns}
              column={col}
              responsive={options.responsive}
            />
          </div>
        ))}
        <div>
          <Button type="link" onClick={handleAddCol}>
            添加列
          </Button>
        </div>
      </FormAttrItem>

      <FormAttrItem label="水平排列方式">
        <Select
          style={{ width: '100%' }}
          placeholder="请选择"
          value={options.justify}
          onChange={(value) => updateOptions({ justify: value })}
        >
          <Select.Option value="start">左对齐</Select.Option>
          <Select.Option value="end">右对齐</Select.Option>
          <Select.Option value="center">居中</Select.Option>
          <Select.Option value="space-around">两侧间隔相等</Select.Option>
          <Select.Option value="space-between">两端对齐</Select.Option>
        </Select>
      </FormAttrItem>

      <FormAttrItem label="垂直排列方式">
        <Select
          style={{ width: '100%' }}
          placeholder="请选择"
          value={options.align}
          onChange={(value) => updateOptions({ align: value })}
        >
          <Select.Option value="top">顶部对齐</Select.Option>
          <Select.Option value="middle">居中</Select.Option>
          <Select.Option value="bottom">底部对齐</Select.Option>
        </Select>
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

export default InputSetting;
