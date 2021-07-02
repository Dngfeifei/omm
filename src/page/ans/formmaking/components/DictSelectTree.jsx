import React, { useContext, useState } from "react";
import { TreeSelect } from 'antd';
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

let treeData = [];

const DictSelectTree = ({ control, formConfig }) => {
  const { options } = control;
  const { updateValue } = useContext(formRenderContext);

  const [value, setValue] = useState(undefined)

  const onChange = value => {
    setValue(value)
    updateValue(control.model, value);
  };

  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder="请选择"
      treeDefaultExpandAll
      disabled={formConfig.disabled || options.disabled}
      onChange={onChange}
    />
  );
}
export default DictSelectTree
