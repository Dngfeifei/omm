import React, { useState, useEffect } from "react";
import { TreeSelect } from 'antd';
import { getAreaList } from '@/page/ans/flow/bpmn-designer/services'

const { TreeNode } = TreeSelect;

const AreaSelectTree = ({ control, formConfig, onChange }) => {
  const { options } = control;
  const [treeData, setTreeData] = useState([])

  useEffect(() => {
    // 查询区域数据
    getAreaList().then((data) => {
      setTreeData(data)
    });
  }, []);

  const renderTreeNode = (item) => {
    if (!item.children) {
      return null
    }
    return (
      <TreeNode
      title={item.name}
      key={item.id}
      value={item.id}
    >
      {item.children.map((item) => (renderTreeNode(item)))}
    </TreeNode>
    )
  }

  return (
    <TreeSelect
      style={{ width: '100%' }}
      value={options.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder={options.placeholder||"请选择"}
      disabled={formConfig.disabled || options.disabled}
      onChange={onChange}
    >
      {renderTreeNode(treeData)}
    </TreeSelect>
  );
}
export default AreaSelectTree
