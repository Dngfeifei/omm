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
import { getTableColumnList } from '/api/form'
import styled from "@emotion/styled";
import useDictMap from '@/page/ans/formmaking/hooks/useDictMap'


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
 */
export default function DataRule(props) {
  const handleOk = () => {
    props.onOk(dataRule)
  };

  const handleCancel = () => {
    props.onCancel()
  };

  // t_express
  const dictMap = useDictMap()
  const [expressList, setExpressList] = useState([])
  useEffect(() => {
    if (dictMap && dictMap['t_express']) {
      setExpressList(dictMap['t_express'])
    }
  }, [dictMap])

  const [fieldList, setFieldList] = useState([])
  useEffect(() => {
    getTableColumnList(props.tableInfo)
      .then(resp => {
        setFieldList(resp.rows)
        // id, nameAndComments
      })
  }, [])

  const updateField = (field, value) => {
    setDataRule({
      ...dataRule,
      [field]: value
    })
  }

  const [dataRule, setDataRule] = useState(props.dataRule || {
    // key: Date.now(),
    name: '',
    className: props.tableInfo.name,
    field: '',
    express: '',
    value: '',
    sqlSegment: '',
    remarks: '',
  })

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
          label="数据规则名称"
        >
          <Input value={dataRule.name} onChange={e => updateField('name', e.target.value)}/>
        </Form.Item>

        <Form.Item
          label="表名"
        >
          <Input value={dataRule.className} onChange={e => updateField('className', e.target.value)} />

        </Form.Item>

        <Form.Item
          label="规则字段"
        >
          <Select value={dataRule.field} onChange={v => updateField('field', v)}>
            {fieldList.map(d => {
              return <Select.Option value={d.name} key={d.name}>{d.nameAndComments}</Select.Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="规则条件"
        >

          <Select value={dataRule.express} onChange={v => updateField('express', v)}>
            {expressList.map(d => {
              return <Select.Option value={d.value} key={d.value}>{d.label}</Select.Option>
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="规则值"
        >
          <Input value={dataRule.value} onChange={e => updateField('value', e.target.value)} />
        </Form.Item>

        <Form.Item
          label="自定义sql"
        >
          <Input value={dataRule.sqlSegment} onChange={e => updateField('sqlSegment', e.target.value)} />
        </Form.Item>

        <Form.Item
          label="备注"
        >
          <Input value={dataRule.remarks} onChange={e => updateField('remarks', e.target.value)} />
        </Form.Item>


      </Form>

    </Modal>
  );
};

DataRule.propTypes = {
  tableInfo: PropTypes.object,
  dataRule: PropTypes.object,
  open: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
