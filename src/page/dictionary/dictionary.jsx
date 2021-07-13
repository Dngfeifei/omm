import React, { Component } from 'react'
import { Modal, Tree, message, Button, Row, Col, Form, Input, Select, Table, Card } from 'antd'
import { GetDictionary, AddDictionary, EditDictionary, DelDictionary, GetDictItems, AddDictItem, EditDictItem, DelDictItem } from '/api/dictionary.js'
// 引入 Tree树形组件
import TreeParant from "@/components/tree/index.jsx"

// 引入字典编辑页
import EditDic from "./editDictionary.jsx"

// 引入页面CSS
import '/assets/less/pages/logBookTable.css'

const { Option } = Select
const { Item } = Form
const { confirm } = Modal;
const { Provider, Consumer } = React.createContext()//组件之间传值
import Pagination from '/components/pagination'

// 树数据过滤转化 添加key title字段
const assignment = (data) => {
    data.forEach((list, i) => {
        list.key = list.id;
        list.value = list.id;
        if (list.hasOwnProperty("dictName")) {
            list.title = list.dictName;
        }
        if (list.hasOwnProperty("children")) {
            if (list.children.length > 0) {
                assignment(list.children)
            }
        } else {
            return
        }
    });
}

class content extends Component {
    SortTable = () => {
        setTimeout(() => {
            let h = this.tableDom.clientHeight - 100;
            this.setState({
                h: {
                    y: (h)
                }
            });
        }, 0)
    }
    componentDidMount() {
        this.SortTable();
        //窗口变动的时候调用
        window.onresize = () => {
            this.SortTable();
        }
    }
    async componentWillMount() {
        this.searchTree()
    }
    state = {
        // 表格默认滚动高度
        h: { y: 240 },
        // 首次进入 
        newEntry: true,
        // 可编辑字段标识
        editingKey: '',
        // 分页参数
        pageConf: {
            limit: 10,
            offset: 0
        },
        // 分页配置
        pagination: {
            pageSize: 10,
            current: 1,
            total: 0,
        },
        // 请求加锁 防止多次请求
        lock: false,
        //左侧角色树相关数据
        tree: {
            //右侧角色树数据
            treeData: [],
        },
        //右侧table相关数据
        table: {
            //右侧角色表格配置
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    editable: false,
                    align: 'center',
                    width: '80px',
                    render: (text, record, index) => `${index + 1}`
                },
                {
                    title: '字典值',
                    dataIndex: 'name',
                    align: 'center',
                },
                {
                    title: '编码值',
                    dataIndex: 'code',
                    align: 'center',
                },
                {
                    title: '顺序',
                    dataIndex: 'serialNumber',
                    align: 'center',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    align: 'center',
                    render: (t, r) => {
                        if (t == 1) {
                            return "启用"
                        } else if (t == 0) {
                            return "禁用"
                        }
                    }
                },
            ],
            //右侧角色表格数据
            dictData: [],
        },
        // 当前字典类型拓展字段
        extendedField: [
            // {
            //     fieldEn: "strvalu1",
            //     fieldCn: "备注",
            //     field_type: "string",
            // }
        ],
        // 表格选中项
        tableSelecteds: null,
        tableSelectedInfo: [],
        //新增修改字典弹窗配置
        newGroupWindow: {
            newGroupModal: false, //弹窗是否显示可见
            newGroupModalType: 0, //0新增  1修改
            newGroupModalTitle: "",//弹窗title
        },
        //字典tree当前选中项ID
        currentID: null,
        currentGroup: {
            dictName: null,//字典名称
            dictCode: null//字典编码
        },
        //字典参数数据 
        newGroup: {
            dictName: null,//字典名称
            dictCode: null//字典编码
        },
        editID: "",
        editType: "add",
        editVisible: false

    }
    //点击行选中选框
    onRow = (record) => {
        return {
            onClick: () => {
                let selectedKeys = [record.id], selectedItems = [record];
                this.setState({
                    tableSelecteds: selectedKeys,
                    tableSelectedInfo: selectedItems
                })
            }
        }
    }
    //数据字典树数据查询
    searchTree = async (params = {}) => {
        // 请求数据字典树数据
        GetDictionary(params)
            .then(res => {
                if (res.success != 1) {
                    message.error("操作失败")
                    return
                } else {
                    //给tree数据赋值key title
                    assignment(res.data)
                    this.setState({
                        tree: {
                            treeData: res.data
                        },
                    })
                    if (this.state.newEntry && res.data) {
                        this.searchList({ basedataTypeId: res.data[0].id })
                        this.setState({
                            currentID: res.data[0].id,
                            extendedField: res.data[0].basedataMetas
                        })
                        this.setState({ newEntry: false })
                    }
                }
            })
    }
    //新增数据字典项
    addGroup = () => {
        // 新增内容区域内容置空 新增内容区域显示
        this.setState({
            newGroup: {
                dictName: null,
                dictCode: null,
            },
            newGroupWindow: {
                newGroupModal: true,
                newGroupModalType: 0,
                newGroupModalTitle: "新增字典"
            },
        })
    }
    //编辑字典
    editGroup = () => {
        let selected = this.state.currentID;
        //1 判断字典tree是否有选中 如无选中提示无选中数据无法修改
        if (selected == "" || selected == null) {
            message.destroy()
            message.warning('没有选中数据,无法进行修改!');
            return
        }
        //2 编辑弹窗展示 
        this.setState({
            newGroup: this.state.currentGroup,
            newGroupWindow: {
                newGroupModal: true,
                newGroupModalType: 1,
                newGroupModalTitle: "编辑字典"
            },
        })
    }
    //删除字典
    delGroup = async _ => {
        //1 判断字典tree是否有选中 如无选中提示无选中数据无法删除
        let selected = this.state.currentID;
        if (selected == "" || selected == null) {
            message.destroy()
            message.warning('没有选中数据,无法进行删除!');
            return
        }
        //2 获取选中项  发起删除请求  
        let _this = this
        confirm({
            title: '删除',
            content: '删除后不可恢复,确定删除吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DelDictionary({ id: selected }).then(res => {
                    if (res.success != 1) {
                        message.error(res.message)
                        return
                    } else {
                        _this.searchTree()
                        let table = Object.assign({}, _this.state.table, { dictData: [] })
                        _this.setState({ table: table })
                        message.success("操作成功")
                    }
                })
            },
        });

    }
    // 树选中后
    onTreeSelect = async (selectedKeys, info) => {
        console.log(info, "info")
        if (!info.selected) {
            // let table = Object.assign({}, this.state.table, { dictData: [] })
            // let pagination = Object.assign({}, this.state.pagination, {
            //     total: 0,
            //     current: 1,
            // })
            // let pageConf = Object.assign({}, this.state.pageConf, {
            //     offset: 0,
            // })
            // this.setState({
            //     currentID: "",
            //     currentGroup: {
            //         dictName: "",
            //         dictCode: ""
            //     },
            //     newGroup: {
            //         dictName: "",
            //         dictCode: ""
            //     },
            //     table: table,
            //     pagination: pagination,
            //     pageConf: pageConf,
            //     extendedField: []
            // })
            return
        }
        let data = info.selectedNodes[0].props.dataRef
        this.setState({
            currentID: data.id,
            currentGroup: {
                dictName: data.dictName,
                dictCode: data.dictCode
            },
            newGroup: {
                dictName: data.dictName,
                dictCode: data.dictCode
            },
            tableSelecteds: [],
            tableSelectedInfo: [],
            pageConf: Object.assign({}, this.state.pageConf, { offset: 0 }),
            extendedField: data.basedataMetas
        })
        // 选中后请求字典项详情列表数据

        this.searchList({ basedataTypeId: data.id, offset: 0 })
    };

    // 通过字典名称查询字典数据
    onSearch = (value) => {
        this.searchTree({ dictName: value })
    }
    //获取新增或修改后的字典名称
    getdictName = (e) => {
        let newGroup = Object.assign({}, this.state.newGroup, { dictName: e.target.value })
        this.setState({
            newGroup: newGroup
        })
    }
    //获取新增或修改后的字典编码
    getdictCode = (e) => {
        let newGroup = Object.assign({}, this.state.newGroup, { dictCode: e.target.value })
        this.setState({
            newGroup: newGroup
        })
    }
    //保存新增或修改后的字典名称
    saveNewGroup = _ => {
        //1 获取input数据
        let params = this.state.newGroup
        //2 校验数据 不能为空 空：提示名称为空不能保存
        if (params.dictName == "" || params.dictName == null) {
            message.destroy()
            message.warning('名称不能为空!');
            return
        }
        if (params.dictCode == "" || params.dictCode == null) {
            message.destroy()
            message.warning('编码不能为空!');
            return
        }
        if (this.state.lock) {
            return
        } else {
            this.setState({ lock: true })
        }
        //3 判断保存类型是新增还是修改
        if (this.state.newGroupWindow.newGroupModalType == 0) {
            //新增 请求新增方法
            let params = this.state.newGroup
            AddDictionary(params).then(res => {
                if (res.success != 1) {
                    message.error("操作失败")
                    return
                } else {
                    // 请求完成后关闭弹窗并将输入框赋值为空
                    this.setState({
                        newGroupWindow: {
                            newGroupModal: false
                        },
                        newGroup: {
                            dictName: '',
                            dictCode: ''
                        }
                    })
                    //左侧字典tree刷新 
                    this.searchTree()
                    message.success("操作成功")
                }
                this.setState({ lock: false })
            })

        } else if (this.state.newGroupWindow.newGroupModalType == 1) {
            //修改 请求修改方法
            let _this = this
            let params = Object.assign({}, this.state.newGroup, { id: this.state.currentID })
            EditDictionary(params).then(res => {
                if (res.success != 1) {
                    message.error("操作失败")
                    return
                } else {
                    // 请求完成后关闭弹窗并将输入框赋值为空
                    this.setState({
                        newGroupWindow: {
                            newGroupModal: false
                        },
                        currentGroup: _this.state.newGroup,
                        newGroup: {
                            dictName: '',
                            dictCode: ''
                        }
                    })
                    //左侧字典tree刷新 
                    this.searchTree()
                    message.success("操作成功")
                }
                this.setState({ lock: false })
            })
        }
    }
    // 查询字典项详情列表
    searchList = (Params = {}) => {
        let params = Object.assign({}, this.state.pageConf, { basedataTypeId: this.state.currentID }, Params)
        GetDictItems(params).then(res => {
            if (res.success != 1) {
                message.error("操作失败")
                return
            } else {
                let data = Object.assign({}, this.state.table, {
                    dictData: res.data.records
                })
                let pagination = Object.assign({}, this.state.pagination, {
                    total: res.data.total,
                    pageSize: res.data.size,
                    current: res.data.current,
                })
                let pageConf = Object.assign({}, this.state.pagination, {
                    limit: res.data.size,
                    offset: (res.data.current - 1) * res.data.size,
                })
                this.setState({ table: data, pagination: pagination, pageConf: pageConf })
            }
        })
    }

    // 分页页码变化
    pageIndexChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { offset: (current - 1) * pageSize });
        let basedataTypeId = this.state.currentID;
        let params = Object.assign({}, pageConf, { basedataTypeId: basedataTypeId })
        this.setState({
            tableSelecteds: [],
            tableSelectedInfo: []
        })
        this.searchList(params)
    }
    // 分页条数变化
    pageSizeChange = (current, pageSize) => {
        let pageConf = Object.assign({}, this.state.pageConf, { limit: pageSize });
        let basedataTypeId = this.state.currentID;
        let params = Object.assign({}, pageConf, { basedataTypeId: basedataTypeId })
        this.setState({
            tableSelecteds: [],
            tableSelectedInfo: []
        })
        this.searchList(params)
    }
    //点击行选中选框
    onRow = (record) => {
        return {
            onClick: () => {
                let selectedKeys = [record.id], selectedItems = [record];
                this.setState({
                    tableSelecteds: selectedKeys,
                    tableSelectedInfo: selectedItems
                })
            }
        }
    }
    // 表格选中后
    onTableSelect = (selectedRowKeys, info) => {
        //获取table选中项
        this.setState({
            tableSelecteds: selectedRowKeys,
            tableSelectedInfo: info
        })
    };
    // 新增字典项
    addItem = () => {
        let selected = this.state.currentID;
        //1 判断字典tree是否有选中 如无选中提示无选中数据无法修改
        if (selected == "" || selected == null) {
            message.destroy()
            message.warning('请先选中您要添加的数据字典类型，然后再进行新增数据字典操作!');
            return
        }
        this.setState({
            editID: selected,
            editType: "add",
            editVisible: true
        })
    }
    //编辑字典项
    editItem = () => {
        let tableSelecteds = this.state.tableSelecteds;
        if (!tableSelecteds || !tableSelecteds.length) {
            message.destroy()
            message.warning("请选中后，再进行修改操作")
            return
        }
        let key = tableSelecteds[0];
        this.setState({
            editID: key,
            editType: "edit",
            editVisible: true
        })
    }
    // 删除字典项
    delItem = () => {
        let tableSelecteds = this.state.tableSelecteds;
        if (!tableSelecteds || !tableSelecteds.length) {
            message.destroy()
            message.warning("请选中后，再进行删除操作")
            return
        }
        let key = this.state.tableSelecteds[0];
        let _this = this;
        confirm({
            title: '删除',
            content: '删除后不可恢复,确定删除吗？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                let ID = _this.state.currentID;//当前字典ID
                DelDictItem({ id: [key] }).then(res => {
                    if (res.success != 1) {
                        message.error("操作失败")
                        return
                    } else {
                        _this.searchList({ basedataTypeId: ID })
                        _this.setState({
                            editingKey: '', tableSelecteds: [],
                            tableSelectedInfo: [],
                        });

                    }
                })
            },
        });

    }
    // 字典项编辑完成
    onOk = () => {
        this.setState({
            editVisible: false
        }, () => {
            this.searchList()
        })
    }
    // 字典项编辑取消
    onCancel = () => {
        this.setState({
            editVisible: false
        })
    }
    //保存字典项
    // saveItem = () => {
    //     let key = this.state.editingKey;
    //     if (!key) {
    //         message.warning("未存在编辑项，无法保存")
    //         return
    //     }
    //     this.props.form.validateFields((error, row) => {
    //         if (error) { return }
    //         var params = JSON.parse(JSON.stringify(row));
    //         let type = this.state.editType;//当前编辑类型
    //         let ID = this.state.currentID;//当前字典ID
    //         // basedataTypeId
    //         if (!type) {
    //             //新增保存
    //             params = Object.assign({}, params, { basedataTypeId: ID })
    //             AddDictItem(params).then(res => {
    //                 if (res.success != 1) {
    //                     message.error("操作失败")
    //                     return
    //                 } else {
    //                     this.setState({ editingKey: '' });
    //                     this.searchList({ basedataTypeId: ID })
    //                 }
    //             })
    //         } else {
    //             //编辑保存
    //             params = Object.assign({}, params, { id: key })
    //             EditDictItem(params).then(res => {
    //                 if (res.success != 1) {
    //                     message.error("操作失败")
    //                     return
    //                 } else {
    //                     this.setState({ editingKey: '' });
    //                     this.searchList({ basedataTypeId: ID })
    //                 }
    //             })
    //         }
    //     })
    // }

    render = _ => {
        let expandColumns = []
        this.state.extendedField.forEach(item => {
            expandColumns.push({
                title: item.fieldCn,
                dataIndex: item.fieldEn,
                align: 'center',
            })
        })
        const { getFieldDecorator } = this.props.form
        const { h } = this.state;
        return <div style={{ border: '0px solid red', background: ' #fff', height: '100%' }} >
            <Row gutter={24} className="main_height">
                <Col span={5} className="gutter-row" style={{ backgroundColor: 'white', paddingTop: '16px', height: '99.7%', borderRight: '5px solid #f0f2f5' }}>
                    <TreeParant treeData={this.state.tree.treeData} selectedKeys={[this.state.currentID]}
                        addTree={this.addGroup} editTree={this.editGroup} deletetTree={this.delGroup}
                        onSelect={this.onTreeSelect}  //点击树节点触发事件
                    ></TreeParant>
                </Col>
                <Col span={19} className="gutter-row main_height" style={{ padding: '30px 10px 0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap' }}>

                    <Form style={{ width: '100%' }}>
                        <Row style={{ textAlign: 'right' }}>
                            <Button type="info" style={{ marginLeft: '10px' }} onClick={this.delItem}>删除</Button>
                            <Button type="info" style={{ marginLeft: '10px' }} onClick={this.editItem}>修改</Button>
                            <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.addItem}>新增</Button>
                        </Row>
                    </Form>
                    <div className="tableParson" style={{ flex: 'auto' }} ref={(el) => this.tableDom = el}>
                        <Provider value={this.props.form}>
                            <Table className='jxlTable' bordered onRow={this.onRow} rowSelection={{ type: "radio", onChange: this.onTableSelect, selectedRowKeys: this.state.tableSelecteds }} dataSource={this.state.table.dictData} columns={this.state.table.columns.concat(expandColumns)} style={{ marginTop: '20px' }} rowKey={"id"} pagination={false} size="small" scroll={h} />
                        </Provider>
                        <Pagination current={this.state.pagination.current} pageSize={this.state.pagination.pageSize} total={this.state.pagination.total} onChange={this.pageIndexChange} onShowSizeChange={this.pageSizeChange} />
                    </div>
                </Col>
            </Row>
            {/* 字典新增修改弹窗 */}
            <Modal
                title={this.state.newGroupWindow.newGroupModalTitle}
                visible={this.state.newGroupWindow.newGroupModal}
                onCancel={_ => this.setState({ newGroupWindow: { newGroupModal: false } })}
                onOk={this.saveNewGroup}
                cancelText="取消"
                okText="保存"
            >
                <Row>
                    <label htmlFor="字典名称">
                        <span className="ant-form-item-required" style={{ width: "18%", display: "inline-block", textAlign: "right" }}>字典名称：</span>
                        <Input placeholder="请输入" value={this.state.newGroup.dictName} onChange={this.getdictName} style={{ margin: "2% 10px", width: '70%' }} /></label>
                </Row>
                <Row>
                    <label htmlFor="字典名称">
                        <span className="ant-form-item-required" style={{ width: "18%", display: "inline-block", textAlign: "right" }}>编码值：</span>
                        <Input placeholder="请输入" value={this.state.newGroup.dictCode} onChange={this.getdictCode} style={{ margin: "2% 10px", width: '70%' }} /></label>
                </Row>
            </Modal>
            {this.state.editVisible ? <EditDic ID={this.state.editID} type={this.state.editType} data={this.state.tableSelectedInfo[0]} extendedField={this.state.extendedField} onOk={this.onOk} onCancel={this.onCancel}></EditDic> : ""}


        </div>
    }
}
const area = Form.create()(content)
export default area













