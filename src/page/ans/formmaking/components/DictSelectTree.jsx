import React, { useContext, useState } from "react";
import { TreeSelect } from 'antd';
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

let treeData = [];

const DictSelectTree = ({ control, formConfig, onChange }) => {
  const { options } = control;
  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={options.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeData={treeData}
      placeholder={options.placeholder||"请选择"}
      treeDefaultExpandAll
      disabled={formConfig.disabled || options.disabled}
      onChange={onChange}
    />
  );
}
export default DictSelectTree
