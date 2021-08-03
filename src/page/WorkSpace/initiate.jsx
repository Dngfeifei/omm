import React, { Component } from 'react'
import {Button, Input, DatePicker, Modal, Tooltip, message, Row, Col, Form} from 'antd';
const { confirm } = Modal;
import { BiProcessList,GetTaskDef } from '/api/initiate'
import Common from '/page/common.jsx'
import { connect } from 'react-redux'
import { ADD_PANE,SET_WORKLIST} from '/redux/action'
import moment from 'moment';


@connect(state => ({
    activeKey: state.global.activeKey,
    resetwork: state.global.resetwork,
}), dispath => ({
    add(pane){dispath({ type: ADD_PANE, data: pane })},
    setWorklist(data){dispath({ type: SET_WORKLIST,data})}
}))

class InitiateList extends Common{

    async componentDidMount () {
        this.search()
    }


    async componentWillReceiveProps (nextprops) {
        if(nextprops.refreshData_demandList === 1){
            this.search()
            this.props.resetRefresh({refreshData_demandList: 0})
        }
    }

    state = Object.assign({}, this.state, {
        search: Object.assign({}, this.state.pageconf),
        columns: [ {
            title: '流程名称',
            width: 200,
            dataIndex: 'name'
        },{
            title: '流程版本',
            width: 150,
            dataIndex: 'version'
        },{
            title: '部署日期',
            width: 130,
            dataIndex: 'deploymentTime'
        }],
        loading: false,
        selectedtable: true,
        pagesizechange: true,
        modalconf: { visible: false, item: {} }
    })

    search = async _ => {
        await this.setState({loading: true, selected: {}})
        let search = Object.assign({}, this.state.search)
        search.pageSize = search.limit
        search.pageNo = (search.offset/search.pageSize)+1
        return BiProcessList(search)
            .then(res => {
                let data = (f => f(f))(f => list => list.map(val => {
                    let baseItem = Object.assign({}, val, { key: val.id })
                    return baseItem
                }))(res.page.list)
                this.setState({
                    tabledata: data,
                    loading: false,
                    pagination: Object.assign({}, this.state.pagination, {
                        total: parseInt(res.page.count),
                        current: search.offset/search.pageSize + 1
                    })
                })
            })
    }

    renderBtn = _ => <Row style={{ margin: "10px 0" }}>
        <Col span={12} >
            <Button style={{ marginRight: "10px" }} onClick={this.startUpAction} type="primary">发起</Button>
        </Col>
    </Row>

     startUpAction = () => {

        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }

        let record = this.state.selected.selectedItems[0];
        //处理流程标题
        let newTitle = { 'processTitle': record.assigneeRealName+" 在"+ moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + " 发起了 "+ record.name };
        record = Object.assign({},record,newTitle)

        let beginStatus = { 'status': "start"};
        record = Object.assign({},record,beginStatus)

        let newRouterNum = { 'routerNum': '6' };
        record = Object.assign({},record,newRouterNum)

         GetTaskDef({procDefId: record.procDefId, status: 'start'}).then( data => {
            if (data.success) {
                let formTip = {formType: data.flow.formType, formUrl: data.flow.formUrl};
                record = Object.assign({}, record, formTip)

                let pane = {
                    title: record.name,
                    key: record.id,
                    url: 'WorkOrder/dynamicSplicing.jsx',
                    params:{
                        reset:this.props.params.type,//刷新本页面key
                        record
                    }
                }
                this.props.add(pane)
            }else{
                message.error("获取表单相关数据错误!")
            }
        })
         
    }
    
    
    
    // renderSearch = _ => <div>
    //     <div className="mgrSearchBar" style={{marginBottom:'10px'}}>
    //         <Input
    //             value={this.state.search.name}
    //             style={{ width: 180, marginRight: "18px" }}
    //             allowClear
    //             onChange={e => this.changeSearch({ name: e.target.value })}
    //             addonBefore="名称" placeholder="名称" />
    //         <Button
    //             onClick={this.search} style={{ marginRight: "10px" }}
    //             type="primary" icon="search" >查询</Button>
    //         <Button
    //             onClick={this.reset}
    //         >重置</Button>
    //     </div>
    // </div>

    
}

const initiateForm = Form.create()(InitiateList)
export default initiateForm
