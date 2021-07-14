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
} from 'antd';
import { getFormItem, saveFormItem } from '/api/form'
import { getDataSource } from '/api/database'
import { getTableList } from '/api/form'


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

/**
 * 表单基本型信息编辑
 */
export default function FormMeta(props) {
  const [dataSourceTree, setDataSourceTree] = useState([])
  const [dataTables, setDataTables] = useState([])

  const updateFormMeta = (key, value) => {
    setFormMeta({
      ...formMeta,
      [key]: value,
    })
  }
  const [formMeta, setFormMeta] = useState({
    id: '',
    code: '',
    autoCreate: '1',
    dataSource: {
      id: 'master',
      name: '本地数据库',
      enName: 'master',
      dbType: ''
    },
    name: '',
    tableName: '',
    remarks: ''
  })

  useEffect(() => {
    getTableList({
      'dataSource.enName': formMeta.dataSource.enName
    })
    .then(resp => {
      setDataTables(resp.rows)
    })

  }, [formMeta.dataSource.enName])

  // 如果是编辑表单，获取表单数据
  useEffect(() => {
    if (props.id) {
      getFormItem({
        id: props.id
      })
      .then(resp => {
        const form = resp.form
        setFormMeta({
          id: form.id,
          code: form.code,
          autoCreate: form.autoCreate,
          dataSource: {
            id: form.dataSource.id,
            name: form.dataSource.name,
            enName: form.dataSource.enName,
            dbType: form.dataSource.dbType,
          },
          name: form.name,
          tableName: form.tableName,
          remarks: form.remarks,
        })
      })
    }
  }, [props.id])

  // 获取数据源
  useEffect(() => {
    // getDataSource()
    //   .then(resp => {
    //     setDataSourceTree(resp.treeData)
    //   })
  }, [])

  const handleDataSourceChange = (sourceId) => {
    let sources = []
    dataSourceTree.forEach(parentNode => {
      sources = sources.concat(parentNode.children)
    })

    const source = sources.find(item => item.id ===  sourceId)
    updateFormMeta('dataSource', {
      id: source.id,
      name: source.name,
      enName: source.enName,
      dbType: ''
    })
  }

  const generateTableName = () => {
    updateFormMeta('tableName', `jp_form_` + Date.now())
  }

  const handleOk = () => {
    saveFormItem(formMeta)
      .then(resp => {
        props.onOk()
      })
  };

  const handleCancel = () => {
    props.onCancel()
  };

  return (
    <Modal
      title={props.id ? '修改表单' : '新建表单'}
      visible={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form
        {...layout}
      >

        <Form.Item
          label="表单名称"
          name="name"
        >
          <Input value={formMeta.name} onChange={(e) => updateFormMeta('name', e.target.value)}/>
        </Form.Item>

        <Form.Item
          label="表单Key"
        >
          <Input value={formMeta.code} onChange={(e) => updateFormMeta('code', e.target.value)}/>
        </Form.Item>

        <Form.Item
          label="所属数据库"
        >
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            allowClear
            onChange={value => handleDataSourceChange(value)}
            value={formMeta.dataSource.id}
          >
            {dataSourceTree.map(node => {
              return (
                <TreeNode title={node.label} selectable={false} key={node.id} value={node.id}>
                  {node.children.map(leaf => {
                    return (
                      <TreeNode title={leaf.label} value={leaf.id} key={leaf.id} />
                    )
                  })}
                </TreeNode>
              )
            })}
          </TreeSelect>
        </Form.Item>

        <Form.Item
          label="是否自动建表"
        >
          <Radio.Group
            onChange={(e) => updateFormMeta('autoCreate', e.target.value)}
            value={formMeta.autoCreate}
          >
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="表名"
        >
          {formMeta.autoCreate === '1' ? (
            <Input.Search
              placeholder="请输入表名"
              value={formMeta.tableName}
              enterButton={<span>生成随机表名</span>}
              onSearch={generateTableName}
              onChange={e => updateFormMeta('tableName', e.target.value)}
            />
          ) : (
            <Select
                value={formMeta.tableName}
                onChange={value => updateFormMeta('tableName', value)}
            >
              {dataTables.map(table => {
                return (
                  <Select.Option value={table.name} key={table.name}>{table.name}</Select.Option>
                )
              })}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          label="备注"
        >
          <Input.TextArea placeholder="请填写备注信息" allowClear onChange={e => updateFormMeta('remarks', e.target.value)} />
        </Form.Item>

      </Form>
    </Modal>
  );
};

FormMeta.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
