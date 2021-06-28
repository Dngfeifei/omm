import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import {
  Modal,
  Button,
  Form,
  Input,
  TreeSelect,
  Radio,
  Select,
  Table,
  Divider,
} from 'antd';
import { getFormItem, createMenu } from '/api/form'
import { getDataSource } from '/api/database'
import { getTableList } from '/api/form'
import { getMenuTreeData } from '/api/menu'
import styled from "@emotion/styled";

export const Info = styled.div`
  padding: 8px 16px;
  background-color: #f0f9eb;
  color: #67C23A;
`



const { TreeNode } = TreeSelect

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18,
  },
};

function mapTreeData(treeData) {
  return treeData ?  treeData.map(item => {
    return {
      title: item.name,
      value: item.id,
      key: item.id,
      children: mapTreeData(item.children),
    }
  }) : []
}


const columns = [
  {
    title: '规则名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '表名',
    dataIndex: 'className',
    key: 'className',
  },
  {
    title: '规则字段',
    dataIndex: 'field',
    key: 'field',
  },
  {
    title: '规则条件',
    dataIndex: 'express',
    key: 'express',
  },

  {
    title: '规则值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '自定义sql',
    dataIndex: 'sqlSegment',
    key: 'sqlSegment',
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
  },

  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <div>
        <Button>修改</Button>
        <Divider type="vertical" />
        <Button>删除</Button>
      </div>
    ),
  },
];
/**
 * 表单基本型信息编辑
 */
export default function FormRelease(props) {
  const [menuList, setMenuList] = useState([])
  useEffect(() => {
    getMenuTreeData()
      .then(resp => {
        setMenuList(mapTreeData(resp.treeData))
      })
  }, [])

  const [inputForm, setInputForm] = useState({
    parent: {
      id: ''
    },
    name: '',
    id: '',
    icon: '',
    dataRuleList: [],
    formId: props.id
  })

  // 获取表单数据
  useEffect(() => {
    if (props.id) {
      getFormItem({
        id: props.id
      })
      .then(resp => {
        const form = resp.form
        setInputForm({
          ...inputForm,
          name: form.name
        })
      })
    }
  }, [])

  const handleOk = () => {
    createMenu(inputForm)
      .then(resp => {
        props.onOk()
      })
  };

  const handleCancel = () => {
    props.onCancel()
  };

  return (
    <Modal
      title="创建菜单"
      visible={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
    >
      <Form
        {...layout}
      >

        <Form.Item
          label="上级菜单"
          required={true}
        >
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            allowClear
            onChange={value => { setInputForm({
              ...inputForm,
              parent: { id: value }
            })}}
            treeData={menuList}
          />

        </Form.Item>

        <Form.Item
          label="名称"
          required={true}
        >
          <Input value={inputForm.name} onChange={(e) => setInputForm({
            ...inputForm,
            name: e.target.value,
          })} />
        </Form.Item>

        <Form.Item
          label="菜单图标"
        >
          <Input value={inputForm.icon} onChange={(e) => setInputForm({
            ...inputForm,
            icon: e.target.value,
          })} />
        </Form.Item>

        <Info>如需对动态表单创建数据权限，请添加数据规则。添加后的规则，可在[菜单管理->数据规则]中查看。</Info>

        <div className="mt10 mb10">
          <Button type="primary">添加数据规则</Button>
        </div>
        <Table columns={columns} dataSource={inputForm.dataRuleList} />


      </Form>
    </Modal>
  );
};

FormRelease.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
