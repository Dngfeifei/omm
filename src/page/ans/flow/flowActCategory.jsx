import React, { Component } from 'react'
import {Button, Input, DatePicker, Modal, Tooltip, message, Row, Col} from 'antd';
const { confirm } = Modal;
import { BiActCategoryList,DelActCategory } from '/api/ActCategory'
import ActCategoryFrom from '/page/ans/flow/form/ActCategoryFrom'
import Common from '/page/common.jsx'

class ActCategoryList extends Common{

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
            title: '备注信息',
            width: 80,
            dataIndex: 'remarks'
        }],
        loading: false,
        selectedtable: true,
        modalconf: { visible: false, item: {} }
    })

    search = async _ => {
        await this.setState({loading: true, selected: {}})
        let search = Object.assign({}, this.state.search)
        return BiActCategoryList(search)
            .then(res => {
                let data = (f => f(f))(f => list => list.map(val => {
                    let baseItem = Object.assign({}, val, { key: val.id })
                    return baseItem
                }))(res.treeData)
                this.setState({
                    tabledata: data,
                    loading: false,
                })
            })
    }



    renderBtn = _ => <Row style={{ margin: "10px 0" }}>
        <Col span={12} >
            <Button style={{ marginRight: "10px" }} onClick={_ => this.addmodal('modalconf', '新增流程分类信息')} type="primary">新增</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.editForm} type="info">修改</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.delCategory} type="info">删除</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.subordinate} type="info">添加下级</Button>
        </Col>
    </Row>

    rendermodal = _ => <div>
        <ActCategoryFrom
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
        let item = this.state.selected.selectedItems[0];

        let conf = {}
        conf["modalconf"] = {
            title: '编辑流程分类信息',
            visible: true,
            type: 'edit',
            item: item
        }
        this.setState(conf)
    }

    subordinate = async () => {
        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }
        let item = this.state.selected.selectedItems[0];
        
        let inate = {parentId:item.id}

        let conf = {}
        conf["modalconf"] = {
            title: '添加下级流程分类',
            visible: true,
            type: 'edit',
            item: inate
        }
        this.setState(conf)
    }

    // 删除
    delCategory = async () => {
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
            content: '确定要删除流程分类: ' + rname + ' 吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DelActCategory(params)
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

export default ActCategoryList
