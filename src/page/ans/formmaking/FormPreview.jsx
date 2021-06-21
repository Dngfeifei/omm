import React, { useEffect, useMemo, useState } from 'react'
import { Button, Table, Modal } from 'antd'
import styled from '@emotion/styled'
import { queryByIdMakeForm, listGenerateForm } from '/api/form'
import FormRender from '@/page/ans/formmaking/lib/FormRender'
import SearchTools from './FormPreview/SearchTools'

const TableTool = styled.div`
  dispaly: flex;
  margin-bottom: 10px;
`
const TableToolLeft = styled.div`
  >span {
    margin-right: 10px;
  }
`

const FormPreview = ({ params }) => {
  const { type: formId } = params
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [total, setTotal] = useState(0)
  const [requestParams, setRequestParams] = useState({
    formId,
    orderBy: '',
    params: '{}',
    pageNo: 1,
    pageSize: 10,
  })
  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [visible, setVisible] = useState(false)
  const [formInstance, setFormInstance] = useState()

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      console.log(selectedRowKeys);
      setSelectedRowKeys(selectedRowKeys)
    },
    selectedRowKeys
  }

  useEffect(() => {
    queryByIdMakeForm({ id: formId }).then(res => {
      if (res.code == 200) {
        setFormInfo(res.form)
        const source = res.form.source
        if (source) {
          const { list } = JSON.parse(source)
          const cusColums = list.map(item => {
            return {
              title: item.name,
              dataIndex: item.model
            }
          })
          setColumns(cusColums)
        }
      }
    })
  }, [])

  useEffect(() => {
    handleSearch({})
  }, [])

  const handleSearch = (params) => {
    const newParams = { ...requestParams, params: JSON.stringify(params) }
    listGenerateForm(newParams).then(res => {
      if (res.code === 200) {
        const { list, count } = res.page
        setTotal(count)
        setDataSource(list)
      }
    })
  }

  const ctrls = useMemo(() => {
    let formModel = []
    if (formInfo.source) {
      const { list } = JSON.parse(formInfo.source)
      formModel = list
    }
    return formModel.filter(item => item.type === 'input')
  }, [formInfo])

  const handleGetForm = (form) => {
    setFormInstance(form);
  }

  return <div>
    <SearchTools ctrls={ctrls} search={handleSearch}></SearchTools>
    <div style={{ padding: 20 }}>
      <TableTool>
        <TableToolLeft>
          <span><Button type="primary" onClick={() => setVisible(true)}>新建</Button></span>
          <span><Button type="default">修改</Button></span>
          <span><Button type="danger">删除</Button></span>
        </TableToolLeft>
      </TableTool>
      <div>
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={[...columns, {
            title: '操作',
            width: 200,
            render: (text, record) => (
              <span>
                <span><Button size="small" type="link">查看</Button></span>
                <span><Button size="small" type="link">修改</Button></span>
                <span><Button size="small" type="link">删除</Button></span>
              </span>
            ),
          }]}
          dataSource={dataSource}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: t => `共 ${t} 条`,
            total: total,
            pageSize: requestParams.pageSize,
            current: requestParams.pageNo,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => {
              const newParams = { ...requestParams, pageNo: page }
              setRequestParams(newParams)
              handleSearch(newParams)
            },
            onShowSizeChange: (current, size) => {
              const newParams = { ...requestParams, pageSize: size, pageNo: 1 }
              setRequestParams(newParams)
              handleSearch(newParams)
            }
          }}
        />
      </div>
    </div>
    <Modal
      title="新建"
      width={720}
      maskClosable={false}
      visible={visible}
      onOk={() => {
        const values = formInstance.getFieldsValue()
        console.log(values);
      }}
      onCancel={() => setVisible(false)}
    >
      <FormRender getForm={form => handleGetForm(form)} formInfo={formInfo} />
    </Modal>
  </div>
}

export default FormPreview
