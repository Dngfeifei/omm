import {Modal, Input, Row, Col, Button, Table} from "antd";
import React, {useEffect, useState} from "react";
import { getProjitemList } from '/api/form'

const { Search } = Input;
/**
 * 权限设置
 */
const ProjitemSelectModal = (props) => {
    let {options, onOk, baseProps} = props;
    const [visible, setVisible] = useState(false)
    const [datas, setDatas] = useState([])
    const [projCode, setProjCode] = useState([])
    const [searchParam, setSearchParam] = useState({})
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0);


    /*** 查询 ***/
    const search = _ => {
        getProjitemList({...searchParam, pageNo, pageSize}).then(res => {
            setDatas(res.page.list.map(e => ({...e, key: e.id})))
            setTotal(parseInt(res.page.count))
        })
    }
    /*** 重置 ***/
    const onReset = _ => {
        setSearchParam({})
    }

    useEffect(()=>{
        search()
    },[pageNo, pageSize])

    // 监听表格页码或排序变化
    function handleTableChange(pagination, filters, sorter) {
        setPageSize(pagination.pageSize)
        setPageNo(pagination.current)
    }

    const handleCancel = () => {
        setVisible(false)
    }
    /*** 分页 ***/
    const pagination = total => ({
        total: total,
        showTotal: () => `共${total}条`,
        size: 'small',
        current: pageNo,
        pageSize: pageSize,
        showSizeChanger: true,
        pageSizeOptions: ['10', '30', '50', '100', '300', '500']
    })
    /*** 列表字段 ***/
    const columns = [{
        title: '项目编号',
        dataIndex: 'projectNumber'
    }, {
        title: '项目名称',
        dataIndex: 'projectName'
    }, {
        title: '项目状态',
        dataIndex: 'status',
    }]
    /*** 双击行 ***/
    const onRowClick = (record, index) => {
        setProjCode(record.projectNumber)
        onOk(record)
        setVisible(false)
    }
  

    return (
        <div>
            <Search 
                onSearch={() => setVisible(true)}
                value={projCode}
                placeholder={options.placeholder}
                defaultValue={options.defaultValue}
                style={{ width: options.width }}
                {...baseProps}
            />
            <Modal title="选择项目" visible={visible} footer={null} onCancel={handleCancel} width={1200}>
                <div className="mgrSearchBar">
                    <Input style={{ width: 200, marginLeft: '10px', display: 'inline-block' }} addonBefore="项目号" onChange={e => setSearchParam({...searchParam, projectNumber: e.target.value})} />
                    <Input style={{ width: 200, marginLeft: '10px', display: 'inline-block' }} addonBefore="项目名称" onChange={e => setSearchParam({...searchParam, projectName: e.target.value})} />
                    <Input style={{ width: 200, marginLeft: '10px', display: 'inline-block' }} addonBefore="项目状态" onChange={e => setSearchParam({...searchParam, projectNumber: e.target.value})} />
                    <Button style={{ marginLeft: '10px', display: 'inline-block' }} type="primary" onClick={search} >查询</Button>
                    <Button style={{ marginLeft: '10px', display: 'inline-block' }} onClick={onReset}>重置</Button>
                </div>
                <Table
                    size='small'
                    className='tinyEditTable'
                    style={{width: '100%', margin: 'auto'}}
                    bordered
                    dataSource={datas}
                    columns={columns}
                    locale={{emptyText: '暂无数据'}}
                    pagination={pagination(total)}
                    onChange={handleTableChange}
                    onRow={(record, index) => ({onDoubleClick: () => onRowClick(record, index)})}
                />
            </Modal>
        </div>
    )
}

export default ProjitemSelectModal
