import React, { Component } from 'react'
import {Button, Input, DatePicker, Modal, Tooltip, message, Row, Col} from 'antd';
const { confirm } = Modal;
const ButtonGroup = Button.Group
import { BiConditionList,DelCondition } from '/api/condition'
import ConditionFrom from '/page/ans/flow/form/ConditionFrom'
import Common from '/page/common.jsx'

class Conditionist extends Common{

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
            title: '名称',
            width: 200,
            dataIndex: 'name'
        },{
            title: '表达式',
            width: 200,
            dataIndex: 'expression',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },{
            title: '备注',
            width: 80,
            dataIndex: 'remarks'
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
        return BiConditionList(search)
            .then(res => {
                let data = (f => f(f))(f => list => list.map(val => {
                    let baseItem = Object.assign({}, val, { key: val.id })
                    return baseItem
                }))(res.page.list)
                this.setState({
                    tabledata: data,
                    loading: false,
                    pagination: Object.assign({}, this.state.pagination, {
                        total: res.page.count,
                        current: search.offset/search.pageSize + 1
                    })
                })
            })
    }


    renderSearch = _ => <div>
        <div className="mgrSearchBar">
            <Input
                value={this.state.search.name}
                style={{ width: 180, marginRight: "18px" }}
                allowClear
                onChange={e => this.changeSearch({ name: e.target.value })}
                addonBefore="名称" placeholder="名称" />
            <Button
                onClick={this.search} style={{ marginRight: "10px" }}
                type="primary" icon="search" >查询</Button>
            <Button
                onClick={this.reset}
            >重置</Button>
        </div>
    </div>


    renderBtn = _ => <Row style={{ margin: "10px 0" }}>
        <Col span={12} >
            <Button style={{ marginRight: "10px" }} onClick={_ => this.addmodal('modalconf', '新增流程表达式信息')} type="primary">新增</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.editForm} type="info">修改</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.delBtn} type="info">删除</Button>
        </Col>
    </Row>

    rendermodal = _ => <div>
        <ConditionFrom
            onCancel={_ => this.cancelform('modalconf')}
            done={_ => this.done()}
            config={this.state.modalconf} />
      </div>

    editForm = async () => {
        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }
        let key = this.state.selected.selectedKeys[0];
        var result = this.state.tabledata.filter(el => { return el.id == key })
        let item = result[0]
        let conf = {}
        conf["modalconf"] = {
            title: '编辑流程表达式信息',
            visible: true,
            type: 'edit',
            item: item
        }
        this.setState(conf)
    }

    // 删除
    delBtn = async () => {
        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }
        let params = this.state.selected.selectedKeys[0];
        let rname = this.state.selected.selectedItems[0].name
        let _this = this
        confirm({
            title: '删除',
            content: '确定要删除流程表达式: ' + rname + ' 吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DelCondition(params)
                    .then(res => {
                        if (res.success == 0) {
                            message.destroy()
                            message.error(res.msg);
                        } else {
                            _this.search();
                        }
                    })
            }
        })
    }

    done = async _ => {
        let type = this.state.modalconf.type
        let config = {}
        config.modalconf = { visible: false, item: {} }
        this.setState(config)
        if (type == 'add') {
            this.search()
        } else {
            this.search()
        }
    }

    
}

export default Conditionist
