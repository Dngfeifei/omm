import React, { Component } from 'react'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {Button, Input, DatePicker, Modal, Tooltip, message, Row, Col, Tag, Radio, Tree, Card} from 'antd';
import { BiDesignList,DeployFlow,DelFlow,ActiveFlow,CopyFlow,UpdateFlowCategory } from '/api/design'
import { BiActCategoryList } from '/api/ActCategory'
import DesignPage from '/page/ans/flow/designPage.jsx'
import Common from '/page/common.jsx'
const { confirm } = Modal;

class DesignList extends Common{

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
            title: '流程KEY',
            width: 200,
            dataIndex: 'key',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },{
            title: '分类',
            width: 80,
            dataIndex: 'procDef.category'
        },{
            title: '流程版本',
            width: 80,
            dataIndex: 'procDef.version',
            // render: t => t ? t: 0,
            render: t =>  {
                if (t) {
                    return <Tag color='blue' key={t}>{t}</Tag>
                }else{
                    return <Tag color='blue' key={t}>0</Tag>
                }
            },
        },{
            title: '流程状态',
            width: 80,
            dataIndex: 'procDef.suspended',
            render: (value, row, index) => {
                if (value  === false) {
                    return <Tag color='red' key={value}>已发布</Tag>
                }
                if (value === undefined) {
                    return <Tag color='blue' key={value}>草稿</Tag>
                }else{
                    return <Tag color='green' key={value}>已挂起</Tag>
                }
            },
            // render: t => t === false ? '已发布' : t ===undefined ?'草稿':'已挂起'
        },{
            title: '更新时间',
            width: 200,
            dataIndex: 'lastUpdated'
        }, {
            title: '操作',
            dataIndex: 'operator',
            width: 100,
            render: (t,r) => <a style={{display: 'inline-block', width: 60}} onClick={ _ => this.editDesignPage(r)}>设计</a>
        }],
        loading: false,
        selectedtable: true,
        pagesizechange: true,
        modalconf: { visible: false, primary: {}, category:{} },
        categoryconf: { visible: false, treeData: {},checkedKey: "" },
        filterText:''
    })

    search = async _ => {
        await this.setState({loading: true, selected: {}})
        let search = Object.assign({}, this.state.search)
        search.pageSize = search.limit
        search.pageNo = (search.offset/search.pageSize)+1
        return BiDesignList(search)
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
                value={this.state.search.filterText}
                style={{ width: 240, marginRight: "18px" }}
                allowClear
                onChange={e => this.changeSearch({ filterText: e.target.value })}
                addonBefore="模型名称" placeholder="请输入关键词" />

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
            <Button style={{ marginRight: "10px" }}  onClick={_ => this.addmodal('modalconf', '新增流程')} type="primary">新建</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.delBtn} type="info">删除</Button>
            <Button style={{marginRight: "10px",backgroundColor:'rgb(102, 204, 68)',borderColor:'rgb(255, 255, 255)' }} onClick={this.setCtegory} type="primary" >设置分类</Button>

            <Button style={{ marginRight: "10px" }} onClick={this.deploy} type="info">发布</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.active} type="info">激活</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.exportXML} type="info">导出</Button>
            <Button style={{ marginRight: "10px" }} onClick={this.copy} type="info">复制</Button>
        </Col>
    </Row>

    cancelDesign = async (key) => {
        let config = {}
        config[key] = Object.assign({}, this.state[key], { visible: false, item: {} })
        this.setState(config)
        this.search();
    }
    
    rendermodal = _ => <div>
        <DesignPage
            onCancel={_ => this.cancelDesign('modalconf')}
            config={this.state.modalconf} />
            
        <Modal title="请选择流程分类"
               visible={this.state.categoryconf.visible}
               onOk={this.putFlowCategory}
               mask={false}
               width={400}
               onCancel={_ => this.cancelform('categoryconf')}
               destroyOnClose={true}
               okText="确认"
               cancelText="取消"
        >
                <Tree
                    onSelect= {this.onSelect}  
                    style={{ height: '400px'}}
                    defaultExpandAll={true}
                    treeData={this.state.categoryconf.treeData}
                />
        </Modal>
    </div>

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
            title: '提示',
            content: '确定删除该流程 '+ rname +' 吗?删除流程会级联删除已经存在的实例与历史数据，且不可恢复，请谨慎操作!',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DelFlow(params)
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

    onSelect = (selectedKeys, info) => {
        this.state.categoryconf.checkedKey = selectedKeys[0]
    };
    
    
    putFlowCategory  = async () => {
        let checkedKey = this.state.categoryconf.checkedKey;
        if(checkedKey == undefined){
            message.destroy()
            message.warning("请选中数据进行设置分类！")
            return
        }

        let item = this.state.selected.selectedItems[0];
        if (!item.procDef.id) {
            message.destroy()
            message.warning("未发布的流程不能设置分类，请先发布流程!")
            return;
        }
        
        let categoryName = "";
        //获取分类名称
        const loop = data =>
            data.map(item => {
                
                if(item.id === checkedKey){
                    categoryName = item.name;
                    return ;
                }
                if (item.children && item.children.length) {
                    return loop(item.children)
                }
                
            });

        loop(this.state.categoryconf.treeData)
        
        let params= {
            id: item.procDef.id,
            category:categoryName
        }

        let _this = this
        UpdateFlowCategory(params)
            .then(res => {
                if (res.success == 0) {
                    message.destroy()
                    message.error(res.msg);
                } else {
                     this.cancelform('categoryconf')
                    _this.search();
                }
            })
    }
    
    deploy = async () => {
        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }
        let item = this.state.selected.selectedItems[0];
        let params = {
            id:item.id,
            category: item.procDef.category ? item.procDef.category : '未分类'
        }

        let _this = this
        confirm({
            title: '提示',
            content: '确认要发布 '+ item.name +' 吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DeployFlow(params)
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

    exportXML = async () => {

        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }
        let key = this.state.selected.selectedKeys[0];
        // window.open(`/flow/app/rest/models/`+key+`/bpmn20?version=` + new Date().getTime())
        window.open(`http://152.136.121.201:8080/jeeplus-vue/app/rest/models/`+key+`/bpmn20?version=` + new Date().getTime())
    }


    //设置分类
    setCtegory = async () => {
        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }
        
        let item = this.state.selected.selectedItems[0];

        BiActCategoryList().then(res => {

            const loop = data =>
                data.map(item => {
                    item.key = item.id
                    item.title = item.name
                    item.value = item.id
                    if (item.children && item.children.length) {
                        return loop(item.children)
                    }
                    return item;
                });

            loop(res.treeData)
            
            this.setState({
                categoryconf:{
                    treeData: res.treeData,
                    visible: true
                }
            })
        })
    }
    
    copy = async () => {
        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }
        let item = this.state.selected.selectedItems[0];

        let _this = this
        confirm({
            title: '提示',
            content: '确认要复制 '+ item.name +' 吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                CopyFlow({id:item.id})
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

    active = async () => {
        if (!this.state.selected.selectedKeys || !this.state.selected.selectedKeys.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }

        let item = this.state.selected.selectedItems[0];

        let _this = this
        confirm({
            title: '提示',
            content: '确定要激活 '+ item.name +' 吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                ActiveFlow({procDefId:item.procDef.id})
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


    // 设计流程界面
    editDesignPage = async (item) => {

        if (!item.id || !item.id.length) {
            message.destroy()
            message.warning("请选中后再进行操作！")
            return
        }
        
        
        let conf = {}
        conf["modalconf"] = {
            title: '流程设计器',
            visible: true,
            type: 'edit',
            primary: item.id,
            category: item.procDef.category
        }
        this.setState(conf)
    }

}

export default DesignList
