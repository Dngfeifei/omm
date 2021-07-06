import React, { useState, useEffect } from "react";
import { TreeSelect } from 'antd';
import { getDepartList } from '@/page/ans/flow/bpmn-designer/services'

const { TreeNode } = TreeSelect;

const OfficeSelectTree = ({ control, formConfig, onChange }) => {
  const { options } = control;
  const [treeData, setTreeData] = useState([])

  useEffect(() => {
    // 查询部门数据
    getDepartList().then((data) => {
      setTreeData(data)
    });
  }, []);

  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={options.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder={options.placeholder||"请选择"}
      disabled={formConfig.disabled || options.disabled}
      onChange={onChange}
    >
      <TreeNode
        title={treeData.name}
        key={treeData.id}
        value={treeData.id}
      >
        {treeData.children &&
          treeData.children.map((item) => (
            <TreeNode
              title={item.name}
              key={item.id}
              value={item.id}
            />
          ))}
      </TreeNode>
    </TreeSelect>
  );
}
export default OfficeSelectTree
