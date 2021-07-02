import React, { useContext, useState } from "react";
import { TreeSelect } from 'antd';
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

let treeData = [
  {
    title: '风行软件公司',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '开发一部',
        value: '0-0-1',
        key: '0-0-1',
      },
      {
        title: '开发二部',
        value: '0-0-2',
        key: '0-0-2',
      },
      {
        title: '开发三部',
        value: '0-0-3',
        key: '0-0-3',
      },
      {
        title: '行政部',
        value: '0-0-4',
        key: '0-0-4',
      },
      {
        title: '财务部',
        value: '0-0-5',
        key: '0-0-5',
      },
    ],
  },
];

const OfficeSelectTree = ({ control, formConfig }) => {
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
export default OfficeSelectTree
