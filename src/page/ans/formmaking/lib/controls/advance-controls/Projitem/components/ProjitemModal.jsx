import {Button, Input, Modal, Table} from "antd";
import React, {useState, useEffect} from "react";
import { getProjitemList } from '/api/form'

const ProjitemModal = ({prop_visible, setValue}) => {

    const [visible, setVisible] = useState(false)
    const [datas, setDatas] = useState([])
    const [searchParam, setSearchParam] = useState({})
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    console.log(visible)
    /*** 查询 ***/
    const search = _ => {
        getProjitemList({...searchParam, pageNo, pageSize}).then(res => {
            console.log(res)
        })
    }

    useEffect(()=>{
        search()
    },[pageSize])

    useEffect(()=>{
        setVisible(prop_visible)
    },[prop_visible])

    const handleOk = () => {
        setValue()
        setVisible(false)
    }
    const handleCancel = () => {
        setVisible(false)
    }
    /*** 分页 ***/
    const pagination = {
        total: 0,
        showTotal: total => `共${total}条`,
        size: 'small',
        current: pageNo,
        pageSize: pageSize,
        showSizeChanger: true,
        pageSizeOptions: ['10', '30', '50', '100', '300', '500'],
        onShowSizeChange: async (current, size) => {
            setPageNo(current)
            setPageSize(size)
        }
    }
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

    return <div>
        <Modal title="选择项目" visible={visible} onOk={handleOk} onCancel={handleCancel}>
            <div className="mgrSearchBar">
                <div className="mb20 w200">
                    <Input addonBefore="项目号" onChange={e => setSearchParam({...searchParam, projectNumber: e.target.value})} />
                    <Input addonBefore="项目名称" onChange={e => setSearchParam({...searchParam, projectName: e.target.value})} />
                    <Input addonBefore="项目状态" onChange={e => setSearchParam({...searchParam, projectNumber: e.target.value})} />
                </div>
                <div className="mb20">
                    <Button onClick={() => {}} type="primary" className="mr20">查询</Button>
                </div>
            </div>
            <Table
                size='small'
                className='tinyEditTable'
                style={{width: '100%', margin: 'auto'}}
                bordered
                dataSource={datas}
                columns={columns}
                locale={{emptyText: '暂无数据'}}
                pagination={pagination}
            />
        </Modal>
    </div>
}

export default ProjitemModal
